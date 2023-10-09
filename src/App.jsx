import React, { useEffect, useState } from 'react'
import { AzureMap, AzureMapsProvider, AzureMapFeature, AzureMapDataSourceProvider, AzureMapLayerProvider } from 'react-azure-maps'
import { AuthenticationType, data } from 'azure-maps-control'
import axios from 'axios'


function App() {
  const [points, setPoints] = useState([]);
  const [subId, setSubId] = useState("")
  const [option, setOption] = useState(null)
  const [lap, setLap] = useState('8')

  useEffect(() => {
    axios.get(`/api/points?lap=${lap}`).then(p => {
      setPoints(p.data.points)
    }).catch(err => {
      console.log(err)
    })
  }, [lap])

  useEffect(() => {
    if(subId.length > 0){
      setOption({
        center: [-79.2026, 36.56],
        language: "en-us",
        zoom: 14,
        style: "satellite",
        authOptions: {
          authType: AuthenticationType.subscriptionKey,
          subscriptionKey: subId
        }
      })
    }
    
  }, [subId])

  const onSubIdChange = (o) => {
    setSubId(o.target.value)
  }

  const onLapChange = (o) => {
    setLap(o.target.value)
  }


  if (option) {
    return (
      <div style={{ height: '900px' }}>
        <label>
        Lap Number: <input name="myLapInput" onChange={onLapChange} />
      </label>
        <AzureMapsProvider>
          <AzureMap options={option}>
            <AzureMapDataSourceProvider id={'LayerExample1 DataSource '}>
              <AzureMapLayerProvider
                id={'LayerExample1 Layer2'}
                options={{
                  opacity: 0.8,
                  iconOptions: {
                    image: 'pin-round-red',
                  },
                }}
                type={'SymbolLayer'}
              />


              {points.map(v => {
                console.log(JSON.stringify(v))
                return (
                  <AzureMapFeature
                    id={'LayerExample1 MapFeature'}
                    type="Point"
                    coordinate={new data.Position(v.longitude, v.latitude)}
                    properties={{
                      title: 'My Title',
                    }}
                  />
                )
              })}


            </AzureMapDataSourceProvider>
          </AzureMap>
        </AzureMapsProvider>
      </div>
    )
  } else {
    return(
      <label>
        Subscription ID: <input name="myInput" onChange={onSubIdChange} />
      </label>
    )
  }

}

export default App

