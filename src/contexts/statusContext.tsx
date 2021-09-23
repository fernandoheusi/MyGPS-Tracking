import React, {
	createContext, 
	ReactNode, 
	useContext, 
	useState
} from 'react';
import { StatusProps } from '../screens/Status';

interface StatusContextData{
	statusArray: StatusProps[];
	setStatusArray: (packageArray:StatusProps[]) => void;
}

interface StatusProviderProps{
	children: ReactNode;
}

const StatusContext = createContext({} as StatusContextData);

function StatusProvider({children}: StatusProviderProps){
	const [statusArray,setStatusArray] = useState<StatusProps[]>([])
	return(
		<StatusContext.Provider value={{statusArray,setStatusArray}}>
			{children}
		</StatusContext.Provider>
	)
}

function useStatus(){
	const context = useContext(StatusContext);
	return context
}

export {StatusProvider,useStatus};