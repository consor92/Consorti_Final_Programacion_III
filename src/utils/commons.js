

async function  alizarPaciente(pacientes) {
    const datosPromises = await Promise.all(pacientes.map(item => {
        const { localidad, cobertura, pref, role, ...resto } = item;

        return {
            ...resto,
            localidad: localidad ? localidad.provincia : '',
            cobertura: cobertura ? cobertura.value : '',
            pref: pref ? pref.pref : '',
            role: role ? role.name : '',
        };
    }));
}

export default alizarPaciente