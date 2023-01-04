import { uuid } from "uuidv4"

const DEBUG = false
const BOARD_LEN = 8

class Game {
    // Static function
    // init function
    static debug_init_board = () => {
        let board = Game.init_board()

        for ( let x = 0; x < BOARD_LEN; x++ ) {
            for ( let y = 0; y < BOARD_LEN; y++ ) {
                board[x][y].type = 'nothing'
                board[x][y].color = 'nothing'
            }
        }

        board[0][4].color = 'b'
        board[0][4].type = 'king'

        board[0][0].color = 'w'
        board[0][0].type = 'rook'
        board[2][2].color = 'w'
        board[2][2].type = 'queen'
        board[5][2].color = 'w'
        board[5][2].type = 'king'
        return board
    }

    static init_board = () => {
        let board = []
        for ( let x = 0; x < BOARD_LEN; x++ ) {
            board.push( [] )
            for ( let y = 0; y < BOARD_LEN; y++ ) {
                board[x].push( {
                    type: 'nothing',
                    color: ( x == 0 || x == 1 ) ? 'b' : ( ( x == 6 || x == 7 ) ? 'w' : 'nothing' )
                } )
            }
        }

        // Black
        board[0][0].type = 'rook'
        board[0][1].type = 'knight'
        board[0][2].type = 'bishop'
        board[0][3].type = 'queen'
        board[0][4].type = 'king'
        board[0][5].type = 'bishop'
        board[0][6].type = 'knight'
        board[0][7].type = 'rook'
        for ( let y = 0; y < BOARD_LEN; y++ ) {
            board[1][y].type = 'pawn'
        }

        // White 
        board[7][0].type = 'rook'
        board[7][1].type = 'knight'
        board[7][2].type = 'bishop'
        board[7][3].type = 'queen'
        board[7][4].type = 'king'
        board[7][5].type = 'bishop'
        board[7][6].type = 'knight'
        board[7][7].type = 'rook'
        for ( let y = 0; y < BOARD_LEN; y++ ) {
            board[6][y].type = 'pawn'
        }

        return board
    }

    // get opposite color 
    static op_clr = ( clr ) => {
        if ( clr == 'w' ) return 'b'
        if ( clr == 'b' ) return 'w'
    }

    // Preview functions 
    static previewFunctions = {
        'pawn': Game.pawn_preview,
        'knight': Game.knight_preview,
        'bishop': Game.bishop_preview,
        'rook': Game.rook_preview,
        'queen': Game.queen_preview,
        'king': Game.king_preview,
        'nothing': () => { return [] }
    }

    static pawn_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = []

        // black
        if ( clr == 'b' ) {
            if ( preX == 7 ) {
                return [] // nothing to move 
            }

            //forward 
            let forward = 1
            if ( preX == 1 ) {
                forward += 1
            }
            for ( let x = preX + 1; x <= preX + forward; x++ ) {
                if ( board[x][preY].type != 'nothing' ) {
                    break
                }
                avaList.push( [x, preY] )
            }

            // eat 
            if ( Game.is_in_range( [preX + 1, preY + 1] ) ) {
                if ( board[preX + 1][preY + 1].color == 'w' ) {
                    avaList.push( [preX + 1, preY + 1] )
                }
            }
            if ( Game.is_in_range( [preX + 1, preY - 1] ) ) {
                if ( board[preX + 1][preY - 1].color == 'w' ) {
                    avaList.push( [preX + 1, preY - 1] )
                }
            }
        }
        // white 
        else if ( clr == 'w' ) {
            if ( preX == 0 ) {
                return []
            }
            //forward 
            let forward = 1
            if ( preX == 6 ) {
                forward += 1
            }
            for ( let x = preX - 1; x >= preX - forward; x-- ) {
                if ( board[x][preY].type != 'nothing' ) {
                    break
                }
                avaList.push( [x, preY] )
            }

            // eat 
            if ( Game.is_in_range( [preX - 1, preY + 1] ) ) {
                if ( board[preX - 1][preY + 1].color == 'b' ) {
                    avaList.push( [preX - 1, preY + 1] )
                }
            }
            if ( Game.is_in_range( [preX - 1, preY - 1] ) ) {
                if ( board[preX - 1][preY - 1].color == 'b' ) {
                    avaList.push( [preX - 1, preY - 1] )
                }
            }
        }
        return avaList
    }

    static knight_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = Game.get_knight_pos_list( prePos )

        avaList = avaList.filter( ( avaPos ) => { return Game.is_in_range( avaPos ) } )
        avaList = avaList.filter( ( avaPos ) => { return board[avaPos[0]][avaPos[1]].color != clr } )
        return avaList
    }

    static bishop_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color

        let upLeftPos = Game.get_straight_list( prePos, -1, -1, clr, board )
        let upRightPos = Game.get_straight_list( prePos, -1, 1, clr, board )
        let DownLeftPos = Game.get_straight_list( prePos, 1, -1, clr, board )
        let DownRightPos = Game.get_straight_list( prePos, 1, 1, clr, board )

        let avaList = [].concat.apply( [], [upLeftPos, upRightPos, DownLeftPos, DownRightPos] )
        return avaList
    }

    static rook_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color

        let upPos = Game.get_straight_list( prePos, -1, 0, clr, board )
        let downPos = Game.get_straight_list( prePos, 1, 0, clr, board )
        let leftPos = Game.get_straight_list( prePos, 0, -1, clr, board )
        let rightPos = Game.get_straight_list( prePos, 0, 1, clr, board )

        let avaList = [].concat.apply( [], [upPos, downPos, leftPos, rightPos] )
        return avaList
    }

    static queen_preview( prePos, board ) {
        let avaList = Game.bishop_preview( prePos, board )
        avaList = avaList.concat( Game.rook_preview( prePos, board ) )

        return avaList
    }

    static king_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = Game.get_king_pos_list( prePos )

        avaList = avaList.filter( ( avaPos ) => {
            let [avaX, avaY] = avaPos
            return board[avaX][avaY].color != clr
        } )

        return avaList
    }

    // Other functions
    static is_in_range( pos ) {
        let [x, y] = pos
        return ( x >= 0 && x <= BOARD_LEN - 1 && y >= 0 && y <= BOARD_LEN - 1 )
    }

    static is_check( board, beCheckedClr ) {
        // Get king positions
        let [kingX, kingY] = [0, 0]
        for ( let x = 0; x < BOARD_LEN; x++ ) {
            for ( let y = 0; y < BOARD_LEN; y++ ) {
                if ( board[x][y].color == beCheckedClr && board[x][y].type == 'king' ) {
                    kingX = x
                    kingY = y
                }
            }
        }
        let kingPos = [kingX, kingY]

        // test pawn 
        if ( beCheckedClr == 'b' ) {
            let possiblePawn_1 = Game.get_info( [kingX + 1, kingY - 1], board )
            if ( possiblePawn_1.type == 'pawn' && possiblePawn_1.color == 'w' ) {
                return true
            }
            let possiblePawn_2 = Game.get_info( [kingX + 1, kingY + 1], board )
            if ( possiblePawn_2.type == 'pawn' && possiblePawn_2.color == 'w' ) {
                return true
            }
        }
        if ( beCheckedClr == 'w' ) {
            let possiblePawn_1 = Game.get_info( [kingX - 1, kingY - 1], board )
            if ( possiblePawn_1.type == 'pawn' && possiblePawn_1.color == 'b' ) {
                return true
            }
            let possiblePawn_2 = Game.get_info( [kingX - 1, kingY + 1], board )
            if ( possiblePawn_2.type == 'pawn' && possiblePawn_2.color == 'b' ) {
                return true
            }
        }

        // test knight 
        let possibleKnightPoses = Game.get_knight_pos_list( kingPos ) // knight positions 
        for ( let pos of possibleKnightPoses ) {
            let possibleKnight = Game.get_info( pos, board )
            if ( possibleKnight.type == 'knight' &&
                ( possibleKnight.color == Game.op_clr( beCheckedClr ) ) ) {
                return true
            }
        }

        // test rook & queen 
        let upInfo = Game.get_straight_info( kingPos, -1, 0, board )
        let downInfo = Game.get_straight_info( kingPos, 1, 0, board )
        let leftInfo = Game.get_straight_info( kingPos, 0, -1, board )
        let rightInfo = Game.get_straight_info( kingPos, 0, 1, board )

        let infos = [upInfo, downInfo, leftInfo, rightInfo]
        for ( let info of infos ) {
            if ( ( info.type == 'rook' || info.type == 'queen' ) &&
                ( info.color == Game.op_clr( beCheckedClr ) ) ) {
                return true
            }
        }

        // test bishop & queen 
        let upRightInfo = Game.get_straight_info( kingPos, -1, 1, board )
        let upLeftInfo = Game.get_straight_info( kingPos, -1, -1, board )
        let downRightInfo = Game.get_straight_info( kingPos, 1, 1, board )
        let downLeftInfo = Game.get_straight_info( kingPos, 1, -1, board )

        infos = [upRightInfo, upLeftInfo, downRightInfo, downLeftInfo]
        for ( let info of infos ) {
            if ( ( info.type == 'bishop' || info.type == 'queen' ) &&
                ( info.color == Game.op_clr( beCheckedClr ) ) ) {
                return true
            }
        }

        // test king 
        let possibleKingPoses = Game.get_king_pos_list( [kingX, kingY] )
        for ( let pos of possibleKingPoses ) {
            let possibleKing = Game.get_info( pos, board )
            if ( possibleKing.type == 'king' &&
                possibleKing.color == Game.op_clr( beCheckedClr ) ) {
                return true
            }
        }
        return false
    }

    static get_info( pos, board ) {
        // Get information of the grid ( safer than access directly )

        let [x, y] = pos

        if ( Game.is_in_range( [x, y] ) == false ) {
            return {
                type: 'nothing',
                color: 'nothing',
                ava: false
            }
        }
        else {
            return board[x][y]
        }
    }

    static get_knight_pos_list( pos ) {
        let [x, y] = pos

        let posList = [
            [x + 1, y + 2],
            [x - 1, y + 2],
            [x + 1, y - 2],
            [x - 1, y - 2],
            [x + 2, y + 1],
            [x - 2, y + 1],
            [x + 2, y - 1],
            [x - 2, y - 1],
        ].filter( ( pos ) => { return Game.is_in_range( pos ) } )

        return posList
    }

    static get_king_pos_list( pos ) {
        let [x, y] = pos

        let posList = [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
            [x + 1, y],
            [x + 1, y - 1],
            [x, y - 1]
        ].filter( ( pos ) => { return Game.is_in_range( pos ) } )

        return posList
    }

    static get_straight_pos( oriPos, delX, delY, board ) {
        // Get the nearest position with piece along certain direction
        // E.g. delX=0; delY=1 => get the nearest position with piece along right side of oriPos
        let [x, y] = oriPos

        while ( Game.is_in_range( [x, y] ) ) {
            x += delX
            y += delY
            let info = Game.get_info( [x, y], board )

            // meet something 
            if ( info.type != 'nothing' ) {
                return [x, y]
            }
        }
        return [x - delX, y - delY]
    }

    static get_straight_info( oriPos, delX, delY, board ) {
        let pos = Game.get_straight_pos( oriPos, delX, delY, board )
        return Game.get_info( pos, board )
    }

    static get_straight_list( oriPos, delX, delY, myClr, board ) {
        let [oriX, oriY] = oriPos
        let straightList = []

        let [x, y] = [oriX + delX, oriY + delY]

        while ( Game.is_in_range( [x, y] ) && Game.get_info( [x, y], board ).color == 'nothing' ) {
            straightList.push( [x, y] )
            x += delX
            y += delY
        }
        if ( Game.get_info( [x, y], board ).color == Game.op_clr( myClr ) ) {
            straightList.push( [x, y] )
        }

        return straightList
    }

    constructor() {
        // Game ids 
        this.gameID = uuid()
        this.wID = ''
        this.bID = ''

        // game status 
        this.playerCnt = 0
        this.board = DEBUG ? Game.debug_init_board() : Game.init_board()
        this.status = ''
        this.turn = 'w'
        this.previewList = []
        for ( let x = 0; x < BOARD_LEN; x++ ) {
            this.previewList.push( [] )
            for ( let y = 0; y < BOARD_LEN; y++ ) {
                this.previewList[x].push( [[]] )
            }
        }
        this.update_preview_list( 'w' )

        // special rules 
        this.special_rule = {
            'castling': {
                'w': {
                    'long': true,
                    'short': true
                },
                'b': {
                    'long': true,
                    'short': true
                }
            }
        }
    }

    move( from, to ) {
        // clean board 
        this.clean_ava()


        // TODO: whether is pass 

        // move 
        let [fromX, fromY] = from
        let [toX, toY] = to
        let toMovePieceType = Game.get_info( from, this.board ).type

        // TODO: Whether is castling 
        if ( this.previewList[fromX][fromY].find( ( pos ) => { return ( pos[0] == to[0] ) && ( pos[1] == to[1] ) } ) ) {
            let piece = this.board[fromX][fromY]
            this.board[fromX][fromY] = {
                type: 'nothing',
                color: 'nothing',
                ava: false
            }
            this.board[toX][toY] = piece
        }
        else {
            // cannot move
            return
        }

        // Check castling condition
        if ( toMovePieceType == 'king' ) {
            this.special_rule['castling'][this.turn]['long'] = false
            this.special_rule['castling'][this.turn]['short'] = false
        }
        // Long  
        else if ( ( toMovePieceType == 'rook' ) && ( fromY == 0 ) ) {
            this.special_rule['castling'][this.turn]['long'] = false
        }
        // short 
        else if ( ( toMovePieceType == 'rook' ) && ( fromY == 7 ) ) {
            this.special_rule['castling'][this.turn]['short'] = false
        }

        console.log( this.special_rule['castling'] )

        // TODO: check pass condition 
        this.check_pawn_transform()
        this.switch_turn()
    }

    preview( prePos ) {
        this.clean_ava()

        // Cancel preview ( previewPos = [] ) 
        if ( prePos.length == 0 ) {
            return this.board
        }

        // Preview position
        let [preX, preY] = prePos
        let pieceType = this.board[preX][preY].type
        if ( this.board[preX][preY].color != this.turn ) {
            return this.board
        }

        // Get preview board 
        let avaList = this.previewList[preX][preY]
        for ( let pos of avaList ) {
            let [x, y] = pos
            this.board[x][y].ava = true
        }
    }

    switch_turn() {
        this.turn = Game.op_clr( this.turn )

        this.update_preview_list()
        this.status = Game.is_check( this.board, this.turn ) ? `${this.turn == 'w' ? 'White' : 'Black'} CHECKED` : ''
        this.status = this.is_checkmate() ? 'checkmate' : this.status
    }

    clean_ava() {
        for ( let x = 0; x < BOARD_LEN; x++ ) {
            for ( let col = 0; col < BOARD_LEN; col++ ) {
                this.board[x][col].ava = false
            }
        }
    }

    check_pawn_transform() {
        for ( let y = 0; y < BOARD_LEN; y++ ) {
            if ( this.board[0][y].type == 'pawn' ) {
                this.board[0][y].type = 'queen'
            }
            if ( this.board[7][y].type == 'pawn' ) {
                this.board[7][y].type = 'queen'
            }
        }
    }

    is_checkmate() {
        for ( let x = 0; x < BOARD_LEN; x++ ) {
            for ( let y = 0; y < BOARD_LEN; y++ ) {
                if ( this.previewList[x][y].length != 0 ) {
                    return false
                }
            }
        }

        return true
    }

    player_join( playerID ) {
        if ( this.playerCnt == 0 ) {
            this.wID = playerID
            this.playerCnt += 1
            return true
        }
        else if ( this.playerCnt == 1 ) {
            this.bID = playerID
            this.playerCnt += 1
            return true
        }
        else {
            // Full
            return false
        }
    }

    update_preview_list() {
        for ( let x = 0; x < BOARD_LEN; x++ ) {
            for ( let y = 0; y < BOARD_LEN; y++ ) {
                // only check grid with current color 
                if ( this.board[x][y].color != this.turn ) {
                    this.previewList[x][y] = []
                    continue
                }

                // current position
                let curPos = [x, y]
                let type = Game.get_info( curPos, this.board ).type
                let avaList = Game.previewFunctions[type]( curPos, this.board )

                // filter check 
                avaList = avaList.filter( ( avaPos ) => {
                    let trialBoard = JSON.parse( JSON.stringify( this.board ) )
                    let [curX, curY] = curPos
                    let [avaX, avaY] = avaPos

                    trialBoard[avaX][avaY] = JSON.parse( JSON.stringify( trialBoard[curX][curY] ) )
                    trialBoard[curX][curY] = {
                        type: 'nothing',
                        color: 'nothing',
                        ava: false
                    }

                    return Game.is_check( trialBoard, this.turn ) == false
                } )

                this.previewList[x][y] = avaList
            }
        }
    }
}

export { Game }