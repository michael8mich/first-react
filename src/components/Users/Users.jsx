import React from 'react';
import Paginator from '../common/Paginator/Paginator';
import User from './User';

let Users = ({ totalUserCount, pageSize, onPageChanged, currentPage, users, ...props }) => {
    return (
        <div>
            <Paginator totalItemsCount={totalUserCount} pageSize={pageSize}
                onPageChanged={onPageChanged} currentPage={currentPage} users={users} />
            <br />
            {
                users.map(user =>

                    <User key={user.id} user={user} followingInProgress={props.followingInProgress}
                        setFollow={props.setFollow} />

                )
            }
        </div >
    )
}


export default Users