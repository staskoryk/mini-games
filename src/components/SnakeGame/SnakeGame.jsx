import React, { useEffect, useState } from 'react';
import styles from './SnakeGame.module.scss'
import { useInterval } from "../../hooks/useInterval";
import { useKeyPress } from "../../hooks/useKeyPress";
import arrowTop from '../../images/arrow-alt-circle-up.png'
import arrowBottom from '../../images/arrow-alt-circle-down.png'
import arrowLeft from '../../images/arrow-alt-circle-left.png'
import arrowRight from '../../images/arrow-alt-circle-right.png'
import died from '../../images/died.png'


const FIELD_SIZE = 16
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()]

const TOP = 'ArrowUp'
const BOTTOM = 'ArrowDown'
const RIGHT = 'ArrowRight'
const LEFT = 'ArrowLeft'

let foodItem = {
    x: Math.floor(Math.random() * FIELD_SIZE),
    y: Math.floor(Math.random() * FIELD_SIZE),
}

const DIRECTION = {
    RIGHT: {x: 1, y: 0},
    LEFT: {x: -1, y: 0},
    TOP: {x: 0, y: -1},
    BOTTOM: {x: 0, y: 1},
}

const getItem = (x, y, snakeSegments) => {
    if (foodItem.x === x && foodItem.y === y) {
        return <div className={styles.cellFood}/>
    }

    for (const segment of snakeSegments) {
        if (segment.x === x && segment.y === y) {
            return <div className={styles.cellSnake}/>
        }
    }
}

const limitByField = (j) => {
    if (j >= FIELD_SIZE) {
        return 0;
    }
    if (j < 0) {
        return FIELD_SIZE - 1
    }

    return j
}

const randomSpawnFood = (segments) => {
    const foodItem = {
        x: Math.floor(Math.random() * FIELD_SIZE),
        y: Math.floor(Math.random() * FIELD_SIZE),
    }
    if (segments.find(segment => segment.x === foodItem.x && segment.y === foodItem.y)) {
        return randomSpawnFood(segments)
    } else {
        return foodItem
    }
}

const newSnakePosition = (segments, direction, setSnakeSegments, score, setScores) => {
    const [head] = segments;
    const newHead = {
        x: limitByField(head.x + direction.x),
        y: limitByField(head.y + direction.y)
    }

    if (collidesWithFood(newHead, foodItem)) {
        setScores(score + 1)
        foodItem = randomSpawnFood(segments)
        setSnakeSegments([newHead, ...segments])
    } else {
        setSnakeSegments([newHead, ...segments.slice(0, -1)])
    }

}

const collidesWithFood = (head, foodItem) => {
    return head.x === foodItem.x && head.y === foodItem.y
}

const refreshGame = (setSnakeSegments, setScores, setDirection) => {
    setDirection(DIRECTION.RIGHT)
    setSnakeSegments([
        {x: 8, y: 7},
        {x: 7, y: 7},
        {x: 6, y: 7},
    ])
    setScores(0)
    foodItem = {
        x: Math.floor(Math.random() * FIELD_SIZE),
        y: Math.floor(Math.random() * FIELD_SIZE),
    }
}

const checkDirection = (currentDirection, changeDirection, setDirection) => {
    if (DIRECTION.BOTTOM !== currentDirection && DIRECTION.TOP === changeDirection) setDirection(DIRECTION.TOP)
    if (DIRECTION.TOP !== currentDirection && DIRECTION.BOTTOM === changeDirection) setDirection(DIRECTION.BOTTOM)
    if (DIRECTION.LEFT !== currentDirection && DIRECTION.RIGHT === changeDirection) setDirection(DIRECTION.RIGHT)
    if (DIRECTION.RIGHT !== currentDirection && DIRECTION.LEFT === changeDirection) setDirection(DIRECTION.LEFT)
}

const SnakeGame = () => {
    const [snakeSegments, setSnakeSegments] = useState([
        {x: 8, y: 7},
        {x: 7, y: 7},
        {x: 6, y: 7},
    ])
    const [scores, setScores] = useState(0)
    const [direction, setDirection] = useState(DIRECTION.RIGHT);

    const keyTopPressed = useKeyPress(TOP)
    const keyBottomPressed = useKeyPress(BOTTOM)
    const keyRightPressed = useKeyPress(RIGHT)
    const keyLeftPressed = useKeyPress(LEFT)

    const [head, ...tail] = snakeSegments

    const intersectsWithItself = tail.some(segment => segment.x === head.x && segment.y === head.y)

    useInterval(() => {
        newSnakePosition(snakeSegments, direction, setSnakeSegments, scores, setScores)
    },  intersectsWithItself ? null : 80)


    useEffect(() => {
        if (keyTopPressed) {
            if (DIRECTION.BOTTOM !== direction) setDirection(DIRECTION.TOP)
        }
        if (keyBottomPressed) {
            if (DIRECTION.TOP !== direction) setDirection(DIRECTION.BOTTOM)
        }
        if (keyRightPressed) {
            if (DIRECTION.LEFT !== direction) setDirection(DIRECTION.RIGHT)
        }
        if (keyLeftPressed) {
            if (DIRECTION.RIGHT !== direction) setDirection(DIRECTION.LEFT)
        }
    }, [keyBottomPressed, keyTopPressed, keyLeftPressed, keyRightPressed, direction])


    return (
        <div className={styles.snakeGameBlock}>
            <div className={styles.informationBlock}>
                <div className={styles.score}>
                    <span>Your Dick: {scores}</span>
                </div>
                <div className={styles.nameGame}>
                    <span>SNAKE</span>
                </div>
                <div className={styles.score}>
                    <span>Biggest Dick: {localStorage.getItem('Score')}</span>
                </div>
            </div>
            <div className={styles.board}>
                {intersectsWithItself &&
                    <div className={styles.windowDead}>
                        <img src={died} alt=""/>
                    </div>
                }
                {FIELD_ROW.map(y => (
                    <div className={styles.cellY} key={y}>
                        {FIELD_ROW.map(x => (
                            <div className={styles.cellX} key={x}>
                                {getItem(x, y, snakeSegments)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.btnRefresh}>
                <button onClick={() => refreshGame(setSnakeSegments, setScores, setDirection)}>RESTART</button>
            </div>
            <div className={styles.mobileArrows}>
                <div className={styles.topArrowBlock}>
                    <img src={arrowTop} alt="" className={styles.arrow} onClick={() => checkDirection(direction, DIRECTION.TOP, setDirection)}/>
                </div>
                <div className={styles.arrows}>
                    <img src={arrowLeft} alt="" className={styles.arrow} onClick={() => checkDirection(direction, DIRECTION.LEFT, setDirection)}/>
                    <img src={arrowRight} alt="" className={styles.arrow} onClick={() => checkDirection(direction, DIRECTION.RIGHT, setDirection)}/>
                </div>
                <div className={styles.bottomArrowBlock}>
                    <img src={arrowBottom} alt="" className={styles.arrow} onClick={() => checkDirection(direction, DIRECTION.BOTTOM, setDirection)}/>
                </div>
            </div>
        </div>
    );
};

export { SnakeGame };