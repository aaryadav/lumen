import { Globe } from 'lucide-react'

const SearchResultMessage = ({ message }) => {
    return (
        <div className='msg search-results flex'>
            <div className="avatar">
                <Globe size={15} />
            </div>
            <div className='flex flex-col'>
                <div className='msg-author'>Sources</div>
                <div className="results">
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
        </div>
    )
}

export { SearchResultMessage }