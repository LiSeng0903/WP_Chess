const DEBUG = true
const CHECK_COLOR = 'b'
const BOARD_LEN = 8

class Game {
    // Static function

    static previewFunctions = {
        'pawn': Game.pawn_preview,
        'knight': Game.knight_preview,
        'bishop': Game.bishop_preview,
        'rook': Game.rook_preview,
        'queen': Game.queen_preview,
        'king': Game.king_preview,
        'nothing': () => { return [] }
    }

    static debug_init_board = () => {
        let board = Game.init_board()

        board[0][4].color = 'nothing'
        board[0][4].color = 'nothing'

        board[3][4].color = 'b'
        board[3][4].type = 'king'

        board[2][2].color = 'w'
        board[2][2].type = 'rook'

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

    static pawn_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = []

        // black
        if ( clr == 'b' ) {
            if ( preX == 7 ) {
                return []
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

    static king_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = []
        for ( let x = preX - 1; x <= preX + 1; x++ ) {
            for ( let y = preY - 1; y <= preY + 1; y++ ) {
                if ( Game.is_in_range( [x, y] ) && board[x][y].color != clr ) {
                    avaList.push( [x, y] )
                }
            }
        }
        return avaList
    }

    static bishop_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = []

        // left up 
        if ( Game.is_in_range( [preX - 1, preY - 1] ) ) {
            for ( let x = preX - 1, y = preY - 1; x >= 0 && y >= 0; x--, y-- ) {
                if ( board[x][y].type != 'nothing' ) {
                    if ( board[x][y].color != clr ) {
                        avaList.push( [x, y] )
                    }
                    break
                }
                avaList.push( [x, y] )
            }
        }

        // left down 
        if ( Game.is_in_range( [preX + 1, preY - 1] ) ) {
            for ( let x = preX + 1, y = preY - 1; x <= 7 && y >= 0; x++, y-- ) {
                if ( board[x][y].type != 'nothing' ) {
                    if ( board[x][y].color != clr ) {
                        avaList.push( [x, y] )
                    }
                    break
                }
                avaList.push( [x, y] )
            }
        }

        // right up
        if ( Game.is_in_range( [preX - 1, preY + 1] ) ) {
            for ( let x = preX - 1, y = preY + 1; x >= 0 && y <= 7; x--, y++ ) {
                if ( board[x][y].type != 'nothing' ) {
                    if ( board[x][y].color != clr ) {
                        avaList.push( [x, y] )
                    }
                    break
                }
                avaList.push( [x, y] )
            }
        }

        // right down 
        if ( Game.is_in_range( [preX + 1, preY + 1] ) ) {
            for ( let x = preX + 1, y = preY + 1; x <= 7 && y <= 7; x++, y++ ) {
                if ( board[x][y].type != 'nothing' ) {
                    if ( board[x][y].color != clr ) {
                        avaList.push( [x, y] )
                    }
                    break
                }
                avaList.push( [x, y] )
            }
        }

        return avaList
    }

    static rook_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = []

        // upward check 
        if ( preX != 0 ) {

            for ( let x = preX - 1; x >= 0; x-- ) {
                if ( board[x][preY].type != 'nothing' ) {
                    // different clr 
                    if ( board[x][preY].color != clr ) {
                        avaList.push( [x, preY] )
                    }
                    break
                }
                avaList.push( [x, preY] )
            }
        }

        // Downward check 
        if ( preX != 7 ) {
            for ( let x = preX + 1; x <= 7; x++ ) {
                if ( board[x][preY].type != 'nothing' ) {
                    // different clr 
                    if ( board[x][preY].color != clr ) {
                        avaList.push( [x, preY] )
                    }
                    break
                }
                avaList.push( [x, preY] )
            }
        }

        // Left 
        if ( preY != 0 ) {
            for ( let y = preY - 1; y >= 0; y-- ) {
                if ( board[preX][y].type != 'nothing' ) {
                    // different clr 
                    if ( board[preX][y].color != clr ) {
                        avaList.push( [preX, y] )
                    }
                    break
                }
                avaList.push( [preX, y] )
            }
        }

        // Right 
        if ( preY != 7 ) {
            for ( let y = preY + 1; y <= 7; y++ ) {
                if ( board[preX][y].type != 'nothing' ) {
                    // different clr 
                    if ( board[preX][y].color != clr ) {
                        avaList.push( [preX, y] )
                    }
                    break
                }
                avaList.push( [preX, y] )
            }
        }

        return avaList
    }

    static queen_preview( prePos, board ) {
        let [preX, preY] = prePos
        let avaList = Game.bishop_preview( prePos, board )
        avaList = avaList.concat( Game.rook_preview( prePos, board ) )

        return avaList
    }

    static knight_preview( prePos, board ) {
        let [preX, preY] = prePos
        let clr = board[preX][preY].color
        let avaList = []

        avaList.push( [preX - 1, preY - 2] )
        avaList.push( [preX - 2, preY - 1] )
        avaList.push( [preX - 2, preY + 1] )
        avaList.push( [preX - 1, preY + 2] )
        avaList.push( [preX + 1, preY - 2] )
        avaList.push( [preX + 2, preY - 1] )
        avaList.push( [preX + 2, preY + 1] )
        avaList.push( [preX + 1, preY + 2] )

        avaList = avaList.filter( ( avaPos ) => { return Game.is_in_range( avaPos ) } )
        avaList = avaList.filter( ( avaPos ) => { return board[avaPos[0]][avaPos[1]].color != clr } )
        return avaList
    }

    static is_in_range( pos ) {
        let [x, y] = pos
        return ( x >= 0 && x <= BOARD_LEN - 1 && y >= 0 && y <= BOARD_LEN - 1 )
    }

    static is_check( board, checkClr ) {
        // Get king positions
        let [kingX, kingY] = [0, 0]
        for ( let x = 0; x < BOARD_LEN; x++ ) {
            for ( let y = 0; y < BOARD_LEN; y++ ) {
                if ( board[x][y].color == checkClr && board[x][y].type == 'king' ) {
                    kingX = x
                    kingY = y
                }
            }
        }
        let kingPos = [kingX, kingY]

        // test pawn 
        if ( checkClr == 'b' ) {
            let possiblePawn_1 = Game.get_info( [kingX + 1, kingY - 1], board )
            if ( possiblePawn_1.type == 'pawn' && possiblePawn_1.color == 'w' ) {
                return true
            }
            let possiblePawn_2 = Game.get_info( [kingX + 1, kingY + 1], board )
            if ( possiblePawn_2.type == 'pawn' && possiblePawn_2.color == 'w' ) {
                return true
            }
        }
        if ( checkClr == 'w' ) {
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
                ( possibleKnight.color == ( checkClr == 'w' ? 'b' : 'w' ) ) ) {
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
                ( info.color == ( checkClr == 'w' ? 'b' : 'w' ) ) ) {
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
                ( info.color == ( checkClr == 'w' ? 'b' : 'w' ) ) ) {
                return true
            }
        }

        // test king 
        let possibleKingPoses = Game.get_king_pos_list( [kingX, kingY] )
        for ( let pos of possibleKingPoses ) {
            let possibleKing = Game.get_info( pos, board )
            if ( possibleKing.type == 'king' &&
                possibleKing.color == ( checkClr == 'w' ? 'b' : 'w' ) ) {
                return true
            }
        }
        return false
    }

    static get_info( pos, board ) {
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

        return [
            [x + 1, y + 2],
            [x - 1, y + 2],
            [x + 1, y - 2],
            [x - 1, y - 2],
            [x + 2, y + 1],
            [x - 2, y + 1],
            [x + 2, y - 1],
            [x - 2, y - 1],
        ]
    }

    static get_king_pos_list( pos ) {
        let [x, y] = pos
        return [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y + 1],
            [x + 1, y + 1],
            [x + 1, y],
            [x + 1, y - 1],
            [x, y - 1]
        ]
    }

    static get_straight_pos( oriPos, delX, delY, board ) {
        // Get the nearest position with piece along certain direction
        // E.g. delX=0; delY=1 => get the nearest position with piece along right side of oriPos

        let [x, y] = oriPos
        while ( Game.is_in_range( [x, y] ) ) {
            x += delX
            y += delY
            let info = Game.get_info( [x, y], board )
            if ( info.type != 'nothing' ) {
                return [x, y]
            }
        }
        return [-1, -1]
    }

    static get_straight_info( oriPos, delX, delY, board ) {
        let pos = Game.get_straight_pos( oriPos, delX, delY, board )
        return Game.get_info( pos, board )
    }

    constructor() {
        this.board = DEBUG ? Game.debug_init_board() : Game.init_board()
        this.turn = 'w'
        this.playerCnt = 0

        this.special_rule = {
            castling: {
                // 入堡
                'b': {
                    'q_side': true,
                    'k_side': true
                },
                'w': {
                    'q_side': true,
                    'k_side': true
                }
            }
        }
    }

    move( from, to ) {
        this.clean_ava()
        let avaBoard = this.preview( from )
        let [fromX, fromY] = from
        let [toX, toY] = to
        if ( avaBoard[toX][toY].ava == true ) {
            let piece = this.board[fromX][fromY]
            this.board[fromX][fromY] = {
                type: 'nothing',
                color: 'nothing',
                ava: false
            }
            this.board[toX][toY] = piece
        }
        else {
            return this.board
        }

        this.clean_ava()

        if ( this.turn == 'w' ) {
            this.turn = 'b'
        }
        else {
            this.turn = 'w'
        }
        this.check_pawn_transform()

        console.log( Game.is_check( this.board, CHECK_COLOR ) )
        return this.board
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

        // Get preview board 
        let avaList = Game.previewFunctions[pieceType]( prePos, this.board )
        avaList = avaList.filter( ( avaPos ) => {
            let trialBoard = JSON.parse( JSON.stringify( this.board ) )
            let [preX, preY] = prePos
            let [avaX, avaY] = avaPos

            trialBoard[avaX][avaY] = JSON.parse( JSON.stringify( trialBoard[preX][preY] ) )
            trialBoard[preX][preY] = {
                type: 'nothing',
                color: 'nothing',
                ava: false
            }

            return Game.is_check( trialBoard, this.turn ) == false
        } )

        for ( let i = 0; i < avaList.length; i++ ) {
            let [x, y] = avaList[i]
            this.board[x][y].ava = true
        }
        return this.board
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
}

export { Game }