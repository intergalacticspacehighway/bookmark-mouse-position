import { useEffect, useReducer } from 'react';

const initialState = {
    positions: []
}

const reducer = (state, action) => {
    switch (action.type){
        case "mousePositions":
            return {...state, positions: JSON.parse(action.payload)}
        default: 
            return state
        }

}

export const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(()=>{
        window.api.receive('fromMain', (e) => {
            dispatch(e)
        })
    },[])

    const deleteAtIndex = (index) => {
        window.api.send('toMain', JSON.stringify({
            type: "deleteAtIndex",
            payload: {
                index
            }
        }))
    }

    console.log('ss ', state)
    return <div>
        {state.positions.map((p, index)=>{
            return <div key={index}>
                <div>{JSON.stringify(p)}</div>
                <button onClick={() => deleteAtIndex(index)}>delete</button>
            </div>
        })}
    </div>;
};
  