import React from 'react';
import s from './ProfileInfo.module.css'


class ProfileStatus extends React.Component {
    state = {
        editMode: false,
        status: this.props.status
    }

    activateEditMode = () => {
        this.setState({
            editMode: !this.state.editMode
        })
        if (this.state.editMode) {
            this.props.updateStatus(1, this.state.status)
        }

    }
    onStatusChange = (event) => {
        this.setState({
            status: event.currentTarget.value
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.status !== this.props.status)
            this.setState({
                status: this.props.status
            })
    }
    render() {
        return (
            <div>
                {!this.state.editMode && <div ><span onDoubleClick={this.activateEditMode}>
                    {this.props.status || "--------"}</span></div>}
                {this.state.editMode && <div ><input autoFocus={true} onBlur={this.activateEditMode}
                    onChange={this.onStatusChange} type="text" value={this.state.status} /></div>}
            </div>
        )
    }


}

export default ProfileStatus