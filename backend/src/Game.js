const DEBUG = true
const BOARD_LEN = 8

class Game {
    // Static function

    static debug_init_board = () => {
        let board = Game.init_board()

        board[0][4].color = 'nothing'
        board[0][4].color = 'nothing'

        board[3][4].color = 'b'
        board[3][4].type = 'king'

        return board
    }

    static init_board = () => {
        let board = []
        for ( let row = 0; row < BOARD_LEN; row++ ) {
            board.push( [] )
            for ( let col = 0; col < BOARD_LEN; col++ ) {
                board[row].push( {
                    type: 'nothing',
                    color: ( row == 0 || row == 1 ) ? 'b' : ( ( row == 6 || row == 7 ) ? 'w' : 'nothing' )
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
        for ( let col = 0; col < BOARD_LEN; col++ ) {
            board[1][col].type = 'pawn'
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
        for ( let col = 0; col < BOARD_LEN; col++ ) {
            board[6][col].type = 'pawn'
        }

        return board
    }

    static previewFunctions = {
        'pawn': Game.pawn_preview,
        'knight': Game.knight_preview,
        'bishop': Game.bishop_preview,
        'rook': Game.rook_preview,
        'queen': Game.queen_preview,
        'king': Game.king_preview,
        'nothing': () => { return [] }
    }

    static pawn_preview( oriX, oriY, board ) {
        let clr = board[oriX][oriY].color
        let avaList = []

        // black
        if ( clr == 'b' ) {
            if ( oriX == 7 ) {
                return []
            }
            //forward 
            let forward = 1
            if ( oriX == 1 ) {
                forward += 1
            }
            for ( let x = oriX + 1; x <= oriX + forward; x++ ) {
                if ( board[x][oriY].type != 'nothing' ) {
                    break
                }
                avaList.push( [x, oriY] )
            }

            // eat 
            if ( Game.is_in_range( [oriX + 1, oriY + 1] ) ) {
                if ( board[oriX + 1][oriY + 1].color == 'w' ) {
                    avaList.push( [oriX + 1, oriY + 1] )
                }
            }
            if ( Game.is_in_range( [oriX + 1, oriY - 1] ) ) {
                if ( board[oriX + 1][oriY - 1].color == 'w' ) {
                    avaList.push( [oriX + 1, oriY - 1] )
                }
            }
        }
        // white 
        else if ( clr == 'w' ) {
            if ( oriX == 0 ) {
                return []
            }
            //forward 
            let forward = 1
            if ( oriX == 6 ) {
                forward += 1
            }
            for ( let x = oriX - 1; x >= oriX - forward; x-- ) {
                if ( board[x][oriY].type != 'nothing' ) {
                    break
                }
                avaList.push( [x, oriY] )
            }

            // eat 
            if ( Game.is_in_range( [oriX - 1, oriY + 1] ) ) {
                if ( board[oriX - 1][oriY + 1].color == 'b' ) {
                    avaList.push( [oriX - 1, oriY + 1] )
                }
            }
            if ( Game.is_in_range( [oriX - 1, oriY - 1] ) ) {
                if ( board[oriX - 1][oriY - 1].color == 'b' ) {
                    avaList.push( [oriX - 1, oriY - 1] )
                }
            }
        }
        return avaList
    }

    static king_preview( oriX, oriY, board ) {
        let clr = board[oriX][oriY].color
        let avaList = []
        for ( let x = oriX - 1; x <= oriX + 1; x++ ) {
            for ( let y = oriY - 1; y <= oriY + 1; y++ ) {
                if ( Game.is_in_range( [x, y] ) && board[x][y].color != clr ) {
                    avaList.push( [x, y] )
                }
            }
        }
        return avaList
    }

    static bishop_preview( oriX, oriY, board ) {
        let clr = board[oriX][oriY].color
        let avaList = []

        // left up 
        if ( Game.is_in_range( [oriX - 1, oriY - 1] ) ) {
            for ( let x = oriX - 1, y = oriY - 1; x >= 0 && y >= 0; x--, y-- ) {
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
        if ( Game.is_in_range( [oriX + 1, oriY - 1] ) ) {
            for ( let x = oriX + 1, y = oriY - 1; x <= 7 && y >= 0; x++, y-- ) {
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
        if ( Game.is_in_range( [oriX - 1, oriY + 1] ) ) {
            for ( let x = oriX - 1, y = oriY + 1; x >= 0 && y <= 7; x--, y++ ) {
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
        if ( Game.is_in_range( [oriX + 1, oriY + 1] ) ) {
            for ( let x = oriX + 1, y = oriY + 1; x <= 7 && y <= 7; x++, y++ ) {
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

    static rook_preview( oriX, oriY, board ) {
        let clr = board[oriX][oriY].color
        let avaList = []

        // upward check 
        if ( oriX != 0 ) {

            for ( let x = oriX - 1; x >= 0; x-- ) {
                if ( board[x][oriY].type != 'nothing' ) {
                    // different clr 
                    if ( board[x][oriY].color != clr ) {
                        avaList.push( [x, oriY] )
                    }
                    break
                }
                avaList.push( [x, oriY] )
            }
        }

        // Downward check 
        if ( oriX != 7 ) {
            for ( let x = oriX + 1; x <= 7; x++ ) {
                if ( board[x][oriY].type != 'nothing' ) {
                    // different clr 
                    if ( board[x][oriY].color != clr ) {
                        avaList.push( [x, oriY] )
                    }
                    break
                }
                avaList.push( [x, oriY] )
            }
        }

        // Left 
        if ( oriY != 0 ) {
            for ( let y = oriY - 1; y >= 0; y-- ) {
                if ( board[oriX][y].type != 'nothing' ) {
                    // different clr 
                    if ( board[oriX][y].color != clr ) {
                        avaList.push( [oriX, y] )
                    }
                    break
                }
                avaList.push( [oriX, y] )
            }
        }

        // Right 
        if ( oriY != 7 ) {
            for ( let y = oriY + 1; y <= 7; y++ ) {
                if ( board[oriX][y].type != 'nothing' ) {
                    // different clr 
                    if ( board[oriX][y].color != clr ) {
                        avaList.push( [oriX, y] )
                    }
                    break
                }
                avaList.push( [oriX, y] )
            }
        }

        return avaList
    }

    static queen_preview( oriX, oriY, board ) {
        let avaList = Game.bishop_preview( oriX, oriY, board )
        avaList = avaList.concat( Game.rook_preview( oriX, oriY, board ) )

        return avaList
    }

    static knight_preview( oriX, oriY, board ) {
        let clr = board[oriX][oriY].color
        let avaList = []

        avaList.push( [oriX - 1, oriY - 2] )
        avaList.push( [oriX - 2, oriY - 1] )
        avaList.push( [oriX - 2, oriY + 1] )
        avaList.push( [oriX - 1, oriY + 2] )
        avaList.push( [oriX + 1, oriY - 2] )
        avaList.push( [oriX + 2, oriY - 1] )
        avaList.push( [oriX + 2, oriY + 1] )
        avaList.push( [oriX + 1, oriY + 2] )

        avaList = avaList.filter( ( avaPos ) => { return Game.is_in_range( avaPos ) } )
        avaList = avaList.filter( ( avaPos ) => { return board[avaPos[0]][avaPos[1]].color != clr } )
        return avaList
    }

    static is_in_range( examPos ) {
        let [x, y] = examPos
        return ( x >= 0 && x <= 7 && y >= 0 && y <= 7 )
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

        // test pawn 
        if ( checkClr == 'b' ) {
            if ( Game.get_type( kingX + 1, kingY - 1, board ) == 'pawn' ||
                Game.get_type( kingX + 1, kingY + 1, board ) == 'pawn' ) {
                return true
            }
        }
        if ( checkClr == 'w' ) {
            if ( Game.get_type( kingX - 1, kingY - 1, board ) == 'pawn' ||
                Game.get_type( kingX - 1, kingY + 1, board ) == 'pawn' ) {
                return true
            }
        }

        // test knight 
        knightPoses = Game.get_knight_pos_list( kingX, kingY )
        for ( let pos of knightPoses ) {
            console.log( knightPoses )
        }

        // test rook & queen 

        // test bishop & queen 

        // test king 
        return false
    }

    static get_type( x, y, board ) {
        if ( Game.is_in_range( [x, y] ) == false ) {
            return 'nothing'
        }
        else {
            return board[x][y].type
        }
    }

    static get_knight_pos_list( x, y ) {
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

        console.log( Game.is_check( this.board, 'b' ) )
        return this.board
    }

    preview( prePos ) {
        this.clean_ava()

        // Cancel preview ( previewPos = [] ) 
        if ( prePos.length == 0 ) {
            return this.board
        }

        // Preview position
        let [row, col] = prePos
        let pieceType = this.board[row][col].type

        // Get preview board 
        let avaList = Game.previewFunctions[pieceType]( row, col, this.board )
        for ( let i = 0; i < avaList.length; i++ ) {
            let [x, y] = avaList[i]
            this.board[x][y].ava = true
        }
        return this.board
    }

    clean_ava() {
        for ( let row = 0; row < BOARD_LEN; row++ ) {
            for ( let col = 0; col < BOARD_LEN; col++ ) {
                this.board[row][col].ava = false
            }
        }
    }

    check_pawn_transform() {
        for ( let col = 0; col < BOARD_LEN; col++ ) {
            if ( this.board[0][col].type == 'pawn' ) {
                this.board[0][col].type = 'queen'
            }
            if ( this.board[7][col].type == 'pawn' ) {
                this.board[7][col].type = 'queen'
            }
        }
    }
}

export { Game }