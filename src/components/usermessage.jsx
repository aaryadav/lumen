import { User } from 'lucide-react'

const UserMessage = ({ message }) => {
    return (
        <div className="msg user-msg">
            <div className="avatar">
                <User size={15} />
            </div>
            <div className="msg-content">
                <div className='msg-author'>You</div>
                {message.content}
            </div>
        </div>
    )
}

export { UserMessage }