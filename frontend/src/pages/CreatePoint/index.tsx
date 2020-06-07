import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import Dropzone from '../../components/Dropzone'

import './style.css'
import logo from '../../assets/logo.svg'

import axios from 'axios'
import api from '../../utils/api'

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECITYResponse{
    nome: string;
}

interface Item{
    id: number,
    title: string,
    image_url: string,
}

const CreatePoint = () => {
    const history = useHistory()

    const [ position, setPosition ] = useState<[number, number]>([0, 0])

    const [ formData, setFormData ] = useState({
        name: '',
        whatsapp: '',
        email: ''
    })
    const [ selectedCity, setSelectedCity ] = useState('');
    const [ selectedUf, setSelectedUf ] = useState('RO');
    const [ selectedItems, setSelectedItems ] = useState<number[]>([])

    const [ items, setItems ] = useState<Item[]>([]);
    const [ ufInitials, setUfInitials ] = useState<string[]>([]);
    const [ cityOptions, setCityOptions ] = useState([]);

    const [ selectedFile, setSelectedFile ] = useState<File>()

    useEffect(() => {
        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cities: any = response.data.map(city => city.nome)

            setCityOptions(cities)
        })
    }, [selectedCity, selectedUf])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const initials = response.data.map(uf => uf.sigla)

            setUfInitials(initials);
        })
    }, [])

    useEffect(() => {
        async function apireq(){
            const response = await api.get('/items')

            setItems(response.data)
        }

        apireq()
    }, [])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([
                position.coords.latitude, 
                position.coords.longitude
            ])
        })
    }, [])

    async function handleFormSubmission(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude ] = position
        const itemsToPass = selectedItems

        const bodyReq = new FormData()
        
        bodyReq.append('name', name);
        bodyReq.append('email', email);
        bodyReq.append('whatsapp', whatsapp);
        bodyReq.append('uf', uf);
        bodyReq.append('city', city);
        bodyReq.append('longitude', String(longitude));
        bodyReq.append('latitude', String(latitude));
        bodyReq.append('items', itemsToPass.join(','));
        
        if(selectedFile) {
            bodyReq.append('image', selectedFile)
        }

        await api.post('/points', bodyReq)
        sessionStorage.setItem('success', 'true')
        history.push('/', { 
            success: true
        })
    }

    function handleMapClick(event: LeafletMouseEvent){
        setPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleItemsToggle(event: any){
        let li = event.target

        if(li.tagName !== 'LI'){
            li = li.parentNode
        }

        const key = li.getAttribute('data-key') * 1
        if(selectedItems.includes(key)){
            const selectedItemsClone = selectedItems.filter((itemId: number) => itemId !== key)

            setSelectedItems(selectedItemsClone)
        }else{
            setSelectedItems([ ...selectedItems, key ])
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { value, name } = event.target

        if(value.length >= 12 && name === 'whatsapp'){
            event.target.value = formData.whatsapp
            return 
        }else if(Number.isNaN(parseInt(value)) && name === 'whatsapp' && value !== ''){
            event.target.value = formData.whatsapp
            return
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt=""/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para pagina inicial
                </Link>
            </header>

            <form action="" onSubmit={handleFormSubmission}>
                <h1>Cadastro do <br/> ponto do coleta</h1>

                <Dropzone onFileUploads={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome</label>

                        <input 
                        type="text" 
                        name="name" 
                        id="name"
                        onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input 
                            type="email" 
                            name="email" 
                            id="email"
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input 
                            type="text" 
                            name="whatsapp" 
                            id="whatsapp"
                            onChange={handleInputChange}
                            maxLength={11}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um ponto no mapa</span>
                    </legend>

                    <Map center={[ -7.2548352000000005, -35.9038976 ]} zoom={15} onClick={handleMapClick}>
                        <TileLayer  
                            url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />

                        <Marker position={position} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (uf)</label>
                            <select 
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={(e) => setSelectedUf(e.target.value)}
                            >
                                {ufInitials.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city" 
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                {cityOptions.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                            key={item.id} 
                            data-key={item.id} 
                            onClick={handleItemsToggle}
                            className={selectedItems.includes(item.id) ? "selected" : ""}>
                                <img src={item.image_url} alt=""/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}

export default CreatePoint