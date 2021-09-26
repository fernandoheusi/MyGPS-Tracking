import {useState} from 'react';

import { useTracking } from '../../services/track';

export type IntervalTypes =  10000 | 5000 | 3000 | 1000;

export function useHome() {
	const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
	const [connectionInterval, setConnectionInterval] = useState<IntervalTypes>(10000);
	const [isTracking,setIsTracking] = useState(false);

	const track = useTracking();

	const toggleSwitch = () => {
		if (isSwitchEnabled) {
			track.stopTracking();
			setIsTracking(false);
		} 
		if (!isSwitchEnabled) {
			track.startTracking(connectionInterval);
			setIsTracking(true);
		}
		setIsSwitchEnabled(state => !state);
	}

	const handleSelectInterval = (interval: IntervalTypes) => {
		if (isTracking){
			track.stopTracking();
			track.startTracking(interval);
		}
		setConnectionInterval(interval);
	}

	return {
		isSwitchEnabled,
		toggleSwitch,
		connectionInterval,
		handleSelectInterval
	}
}