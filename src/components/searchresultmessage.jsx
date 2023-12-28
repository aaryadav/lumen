import { Globe } from 'lucide-react'

const SearchResultMessage = ({ message }) => {
    return (
        <div className='msg search-results flex'>
            <div className="avatar">
                <Globe size={15} />
            </div>
            <div className="results">
                <div className='msg-author'>Sources</div>

                {
                    message.content.map((result, idx) => (
                        <a className='search-result' key={idx} href={result.url} target="_blank" rel="noopener noreferrer" >
                            <div className=''>
                                <div className='search-result-title'>{result.title}</div>
                            </div>
                        </a>
                    ))
                }
            </div>
        </div>
    )
}

export { SearchResultMessage }