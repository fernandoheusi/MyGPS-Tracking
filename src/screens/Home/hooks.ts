import {useState, useEffect} from 'react';

import { useTracking } from '../../services/track';

export type IntervalTypes =  10000 | 5000 | 3000 | 1000;

export function useHome() {
	const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
	const [connectionInterval, setConnectionInterval] = useState<IntervalTypes>(10000);
	const [isTracking,setIsTracking] = useState(false);

	const track = useTracking();

	const toggleSwitch = async () => {
		if (isSwitchEnabled) {
			setIsTracking(await track.stopTracking());
		} 
		if (!isSwitchEnabled) {
			setIsTracking(await track.startTracking(connectionInterval));
		}
		setIsSwitchEnabled(state => !state);
	}

	const handleSelectInterval = async (interval: IntervalTypes) => {
		if (isTracking){
			await track.stopTracking();
			await track.startTracking(interval);
		}
		setConnectionInterval(interval);
	}

	useEffect(() => {
		if(isTracking && !isSwitchEnabled) track.stopTracking()
	},[])
	
	return {
		isSwitchEnabled,
		toggleSwitch,
		connectionInterval,
		handleSelectInterval
	}
}