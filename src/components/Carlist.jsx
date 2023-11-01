import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { Button } from '@mui/material';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
    const [cars, setCars] = useState([]);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carrestapi.herokuapp.com/cars')
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
    };

    const deleteData = (link) => {
        fetch(link, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    alert('Car deleted successfully.');
                    fetchData();
                } else {
                    console.error('Failed to delete car.');
                }
            })
            .catch(err => console.error(err))
    };

    const saveCar = (cars) => {
        fetch('https://carrestapi.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cars)
        })
            .then(res => fetchData())
            .catch(err => console.error(err))
    }

    const updateCar = (cars, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cars)
        })
            .then(res => fetchData())
            .catch(err => console.error(err))
    }

    const columns = [
        { headerName: 'Brand', field: 'brand', filter: true },
        { headerName: 'Model', field: 'model', filter: true },
        { headerName: 'Color', field: 'color', filter: true },
        { headerName: 'Fuel', field: 'fuel', filter: true },
        { headerName: 'Year', field: 'year', filter: true },
        { headerName: 'Price', field: 'price', filter: true },
        {
            cellRenderer: (params) => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Editcar updateCar={updateCar} car={params.data} fetchData={fetchData} />
                    <Button onClick={() => deleteData(params.data._links.self.href)}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div className='ag-theme-material' style={{ height: '1000px', width: '80%', margin: 'auto', }}>
            <Addcar saveCar={saveCar} />
            <AgGridReact
                columnDefs={columns}
                rowData={cars}
            />
        </div>
    );
}