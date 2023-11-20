import React from 'react';
import { useEffect, useState } from 'react'
import userService from '../../service/user';

function Dashboard() {

    const [users, setUsers] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const response = await userService.getUser()
            setUsers(response)
        }
        fetchData()
    }, [])


    return (
        <>
            <h1>MENU</h1>
            <h3> {JSON.stringify(users, null, 3)} </h3>
        </>
    )

}

export default Dashboard;