import React from 'react';
import s from './Post.module.css'
const Post = (props) => {
    return <div className={s.item}>
        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSZ-pWeVqzQPiJchi9s50JrsgA-PEvU-pW7Dw&usqp=CAU'></img>
        {props.message}
        <div>
            <span>Like</span>
        </div>

    </div>
}

export default Post