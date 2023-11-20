const express = require('express')

const Agendas = require('../schemas/agenda')
const Dias = require('../schemas/dias')
const Turnos = require('../schemas/turnos')
const Especialidades = require('../schemas/especialidades')


const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const router = express.Router()

//  ----------  END POINT -----------

router.post('/', createAgenda)
router.post('/dia', createDia)
router.post('/turno', createTurno)
router.get('/', getAllAgendas)
//router.get('/view/:idDia' , getAgendaPorDia)
//router.get('/:matricula' , getAgendaDelMedico)
//router.patch('/dia/idDia' , patchEditarPorDia)



module.exports = router


//ya que no pude realizar vien los populate() cuando los datos don Arrays, plantie el camino largo de armar el JSOn a mano 
async function getAllAgendas(req, res, next) {
    try {
        const agendas = await Agendas.find().populate({
            path: 'matricula',
            model: 'User',
            select: 'matricula nombre apellido especialidad',
        })

        //const especialidadInfo = await Especialidades.findById(agendas.matricula.especialidad);

        const agendasTransformadas = await Promise.all(agendas.map(async (agenda) => {
            // Extraer la información necesaria del médico
            const { nombre, apellido, matricula } = agenda.matricula;

            // Obtener información de la especialidad para la única matrícula
            const especialidadInfo = await Especialidades.findById(agenda.matricula.especialidad);
            const especialidad = especialidadInfo ? especialidadInfo.value : null;

            // Crear una nueva estructura con los campos deseados
            return {
                matricula,
                nombre,
                apellido,
                especialidad, // Valor de Especialidades.value para la única matrícula
                disponibilidad: agenda.disponibilidad,
            };
        }));

        let contadorAutoincrementable = 1;
        const datosTransformados = agendasTransformadas.map(elemento => ({
            ...elemento,
            key: contadorAutoincrementable++,
            disponibilidad: elemento.disponibilidad.id_dias
        }));


        // AHasta aca ya tengo pedido los datos a la agenda y en formato JSON como los necesito
        // ahora busco los datos de los dias y los turno para esa agenda y armo un array


        // Obtener todos los ObjectIds en un solo array
        const objectIds = datosTransformados.reduce((acc, obj) => {
            if (obj.disponibilidad && Array.isArray(obj.disponibilidad)) {
                acc.push(...obj.disponibilidad.map(id => new ObjectId(id)));
            }
            return acc;
        }, []);

        // Filtrar duplicados si es necesario
        const uniqueObjectIds = [...new Set(objectIds)];

        // Usar Promise.all para esperar a que todas las consultas se completen
        const resultados = await Promise.all(uniqueObjectIds.map(id => Dias.findById(id)));

        // Mapear resultados a un objeto por id para facilitar el acceso
        const resultadosPorId = resultados.reduce((acc, result) => {
            if (result && result._id) {
                acc[result._id] = result;
            }
            return acc;
        }, {});

        // Reemplazar cada elemento en la propiedad disponibilidad con los datos de resultados
        datosTransformados.forEach(obj => {
            if (obj.disponibilidad && Array.isArray(obj.disponibilidad)) {
                obj.disponibilidad = obj.disponibilidad.map(id => resultadosPorId[id]);
            }
        });

        ///////////////// array citas //////////////////

// Función para transformar las citas
const transformarCitas = async (citasIds, contador) => {
    const citasTransformadas = [];
    const idsArray = Array.isArray(citasIds) ? citasIds : [citasIds];

    for (const citaId of idsArray) {
        const cita = await Turnos.findById(citaId).lean();

        if (cita) {
            // Utilizar JSON.parse(JSON.stringify()) para hacer una copia profunda del objeto y eliminar las referencias internas de Mongoose
            const citaTransformada = JSON.parse(JSON.stringify({
                idRecord: contador++,
                idTurno: cita.idTurno,
                hora: cita.hora,
                consultorio: cita.consultorio,
                paciente: cita.paciente ? cita.paciente._id : '',
                type: cita.type
            }));

            citasTransformadas.push(citaTransformada);
        }
    }

    const citasFiltradas = citasTransformadas.filter(cita => Object.values(cita).some(value => value !== '' && value !== null));

    return citasFiltradas;
};
        
        

        const nuevoDatosTransformados = await Promise.all(
            datosTransformados.map(async medico => {
                const nuevoMedico = { ...medico };
                nuevoMedico.disponibilidad = await Promise.all(
                    medico.disponibilidad.map(async disponibilidad => {
                        const citasTransformadas = await transformarCitas(disponibilidad.citas.id,1);
        
                        if (citasTransformadas.length === 0) {
                            console.log(`No hay citas transformadas para médico ${medico.key}, disponibilidad ${disponibilidad._id}`);
                        }
        
                        return {
                            idDia: disponibilidad.idDia,
                            fecha: disponibilidad.fecha,
                            type: disponibilidad.type,
                            descripcion: disponibilidad.descripcion,
                            citas: citasTransformadas
                        };
                    })
                );
        
                return nuevoMedico;
            })
        );



        res.send(nuevoDatosTransformados)

    } catch (err) {
        next(err)
    }

}

async function createTurno(req, res, next) {
    const turno = req.body

    try {
        if (!turno) {
            res.status(404).send('Sin datos')
        }

        const maxIdTurno = await getMaxIdTurnos();

        if (maxIdTurno !== null) {
            turno.idTurno = maxIdTurno + 1;
        } else {
            turno.idTurno = 1;
        }

        console.log('create Turno: ', turno)

        const turnoCreate = await Turnos.create(turno);

        res.send(turnoCreate)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear el día.')
        next(err)
    }
}

async function createDia(req, res, next) {

    const dia = req.body

    try {
        if (!dia) {
            res.status(404).send('Sin datos')
        }

        const maxIdDia = await getMaxIdDia();

        if (maxIdDia !== null) {
            dia.idDia = maxIdDia + 1;
        } else {
            dia.idDia = 1;
        }

        console.log('create Dia: ', dia)

        const diaCreate = await Dias.create(dia);

        res.send(diaCreate)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear el día.')
        next(err)
    }
}

async function createAgenda(req, res, next) {
    console.log('create Agenda: ', req.body)

    const agenda = req.body

    try {
        if (!agenda) {
            res.status(404).send('Sin datos')
        }

        //const roleCreated  = await Agendas.create({ ...agenda })
        const agendaCreate = await Agendas.insertMany(agenda)

        res.send(agendaCreate)
    } catch (err) {
        next(err)
    }
}



async function getMaxIdDia() {
    try {
        const maxIdDiaDocument = await Dias.findOne({}, {}, { sort: { idDia: -1 } });

        if (maxIdDiaDocument) {
            const maxIdDia = maxIdDiaDocument.idDia;
            return maxIdDia;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el número máximo de idDia:', error);
        throw error;
    }
}

async function getMaxIdTurnos() {
    try {
        const maxIdTurnoDocument = await Turnos.findOne({}, {}, { sort: { idTurno: -1 } });

        if (maxIdTurnoDocument) {
            const maxIdTurno = maxIdTurnoDocument.idTurno;
            return maxIdTurno;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el número máximo de idDia:', error);
        throw error;
    }
}

module.exports = router