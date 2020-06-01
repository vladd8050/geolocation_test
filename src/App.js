import React, { useEffect, useCallback, useState, useMemo } from 'react';

import { useGeolocation } from 'react-use';
import { Helmet } from 'react-helmet';
import { Slider } from 'antd';
import axios from 'axios';

import './App.css';

function App() {


	const [ temp, setTemp ] = useState(0);
  const [ weatherIco, setWeatherIco ] = useState();
  const [coord, setCoord] = useState();

  const state = useGeolocation();
  useEffect(() => {
    if (state && state.latitude) {
      const {latitude, longitude} = state
      setCoord({latitude, longitude})
    }
  }, [state])
  
	const getWeather = useCallback(
		async () => {
			if (coord && coord.latitude) {
				const { data } = await axios.get(
					`https://api.openweathermap.org/data/2.5/weather?lat=${coord.latitude}&lon=${coord.longitude}&appid=7f75795554ce4909c726f82e91ab8f7a`
				);
				const { weather = [], main: { temp: tTemp = 0 } = {} } = data;
				if (weather.length) {
					setWeatherIco(weather[0].icon);
				}

				setTemp(tTemp - 273.15);
			}
		},
		[ coord ]
	);

  useEffect(()=>{
    getWeather();
  }, [coord, getWeather]);



	let bodyClassName = useMemo(() => {
    switch (true) {
      case temp <= -10:
        return 'color01';
      case temp > -10 && temp <= 30:
        return 'color02';
      case temp > 30:
        return 'color03';
      default:
        return '';
    }
  }, [temp])
	

	const handleSlider = useCallback((value) => {
		setTemp(value);
  }, [setTemp]);
  
	return (
		<div className="App">
			<Helmet>
				<body className={bodyClassName} />
			</Helmet>
			<header className="App-header">
				{weatherIco && (
					<img
						src={`https://openweathermap.org/img/wn/${weatherIco}@2x.png`}
						className="App-logo"
						alt="logo"
					/>
				)}
        <Slider min={-100} value={temp} onChange={handleSlider} style={{ width: 300 }} />
        <div>Adjust temperature</div>
			</header>
		</div>
	);
}

export default App;
