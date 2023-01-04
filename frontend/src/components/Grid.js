import styled from 'styled-components'

const GridWrapper = styled.div`
    height: 100%;
    width: 12.5%;
    background-color: ${( { x, y, ava, isFocus } ) => {
        if ( isFocus ) { return '#dab141' }
        else if ( ava ) {
            return ( ( x + y ) % 2 == 0 ? '#B4D4D2' : '#F5DEDE' )
        }
        else {
            return ( ( x + y ) % 2 == 0 ? '#7d9492' : '#D6B5B6' )
        }
    }
    };
    display: flex;
    justify-content: center; 
    align-items: center;
    ${( { isFocus } ) => {
        if ( isFocus ) {
            return 'box-shadow: inset 0px 0px 0px 5px #a08332;'
        }
    }}
`

const GridImgWrapper = styled.img`
    height: 70%;
`

const Grid = ( { x, y, image, ava, isFocus, clickHandler } ) => {
    return (
        <GridWrapper x={x} y={y} ava={ava} isFocus={isFocus} onClick={clickHandler} >
            {image && <GridImgWrapper src={image} alt="no img" />}
        </GridWrapper >
    )
}

export { Grid }