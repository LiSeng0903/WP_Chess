import { DEBUG_MODE, POS, TYPE } from "./constants.js"

class Game {
    static keys = {
        'pawn': {
            'w': '♙',
            'b': '♟'
        },
        'bishop': {
            'w': '♗',
            'b': '♝'
        },
        'rook': {
            'w': '♖',
            'b': '♜'
        },
        'knight': {
            'w': '♘',
            'b': '♞'
        },
        'queen': {
            'w': '♕',
            'b': '♛'
        },
        'king': {
            'w': '♔',
            'b': '♚'
        },
        'nothing': {
            'nothing': ' '
        }
    }

    static previewFunctions = {
        'pawn': Game.pawn_preview,
        'bishop': Game.bishop_preview,
        'rook': Game.rook_preview,
        'king': Game.king_preview,
        'queen': Game.queen_preview,
        'knight': Game.knight_preview,
        'nothing': () => { return [] }
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

    static queen_preview( oriX, oriY, board ) {
        let avaList = Game.bishop_preview( oriX, oriY, board )
        avaList = avaList.concat( Game.rook_preview( oriX, oriY, board ) )

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

    static is_in_range( examPos ) {
        let [x, y] = examPos
        return ( x >= 0 && x <= 7 && y >= 0 && y <= 7 )
    }

    constructor() {
        this.board = []
        this.init_board()
        this.turn = 'w'
        this.playerCnt = 0
    }

    init_board() {
        for ( let i = 0; i < 8; i++ ) {
            this.board.push( [] )
            for ( let j = 0; j < 8; j++ ) {
                this.board[i].push( {
                    type: 'nothing',
                    color: ( i == 0 || i == 1 ) ? 'b' : ( ( i == 6 || i == 7 ) ? 'w' : 'nothing' ),
                    ava: false
                }
                )
            }
        }

        this.board[0][0].type = 'rook'
        this.board[0][1].type = 'knight'
        this.board[0][2].type = 'bishop'
        this.board[0][3].type = 'queen'
        this.board[0][4].type = 'king'
        this.board[0][5].type = 'bishop'
        this.board[0][6].type = 'knight'
        this.board[0][7].type = 'rook'
        for ( let y = 0; y < 8; y++ ) {
            this.board[1][y].type = 'pawn'
        }

        this.board[7][0].type = 'rook'
        this.board[7][1].type = 'knight'
        this.board[7][2].type = 'bishop'
        this.board[7][3].type = 'queen'
        this.board[7][4].type = 'king'
        this.board[7][5].type = 'bishop'
        this.board[7][6].type = 'knight'
        this.board[7][7].type = 'rook'
        for ( let y = 0; y < 8; y++ ) {
            this.board[6][y].type = 'pawn'
        }

        if ( DEBUG_MODE ) {
            this.board[POS[0]][POS[1]].type = TYPE
            this.board[POS[0]][POS[1]].color = 'w'
        }
    }

    draw_board( mode = 'type' ) {
        for ( let i = 0; i < 19; i++ ) {
            process.stdout.write( '-' )
        }
        process.stdout.write( '\n' )

        for ( let x = 0; x < 8; x++ ) {
            process.stdout.write( '| ' )
            for ( let y = 0; y < 8; y++ ) {
                let focusPiece = this.board[x][y]
                if ( mode == 'type' ) {
                    process.stdout.write( Game.keys[focusPiece.type][focusPiece.color] )
                }
                else if ( mode == 'ava' ) {
                    if ( focusPiece.ava == true ) {
                        process.stdout.write( 'O' )
                    }
                    else {
                        process.stdout.write( '.' )
                    }
                }
                process.stdout.write( ' ' )
            }
            process.stdout.write( '|' )
            process.stdout.write( '\n' )
        }

        for ( let i = 0; i < 19; i++ ) {
            process.stdout.write( '-' )
        }
        process.stdout.write( '\n' )
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
        return this.board
    }

    preview( previewPos ) {
        this.clean_ava()
        if ( previewPos.length == 0 ) {
            return this.board
        }

        let [x, y] = previewPos
        let pieceType = this.board[x][y].type

        let avaList = Game.previewFunctions[pieceType]( x, y, this.board )
        for ( let i = 0; i < avaList.length; i++ ) {
            let [x, y] = avaList[i]
            this.board[x][y].ava = true
        }
        return this.board
    }

    clean_ava() {
        for ( let x = 0; x < 8; x++ ) {
            for ( let y = 0; y < 8; y++ ) {
                this.board[x][y].ava = false
            }
        }
    }

    check_pawn_transform() {
        for ( let y = 0; y < 8; y++ ) {
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