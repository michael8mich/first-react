import React, { useState } from 'react';
import s from './Paginator.module.css';
import cn from 'classnames'
let Paginator = ({ totalItemsCount, pageSize, currentPage, onPageChanged, portionSize = 2 }) => {
    let pageCount = Math.ceil(totalItemsCount / pageSize);
    let pages = [];
    for (let i = 1; pageCount >= i; i++) {
        pages.push(i)
    }

    let portionCount = Math.ceil(pageCount / portionSize);
    let [portionNumber, setPortionNumber] = useState(1)
    let leftPortionNumber = (portionNumber - 1) * portionSize + 1
    let rightPortionNumber = portionNumber * portionSize


    return (
        <div className={cn(s.paginator)}>
            {portionNumber > 1 &&
                <button onClick={() => setPortionNumber(portionNumber - 1)}>Prev</button>}
            {pages.filter(p => p >= leftPortionNumber && p <= rightPortionNumber)
                .map(p => {
                    return <span key={p} onClick={(e) => onPageChanged(p)}
                        // className={(currentPage === p && s.selectedPage) + ' ' + s.pageSelector}  
                        className={cn({ [s.selectedPage]: currentPage === p }, s.pageSelector)}
                    >{p}</span>
                })}
            {portionCount > portionNumber &&
                <button onClick={() => setPortionNumber(portionNumber + 1)}>Next</button>}
        </div>

    )
}
export default Paginator