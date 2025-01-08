'use client';
import React, { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface SearchProps {
    initialContent? : string
}

const Search: React.FC<SearchProps> = ({ initialContent }) => {
    const [content, setContent] = useState('');
    const [inputUser, setInputUser] = useState(false);
    const [splitInput, setSplitInput] = useState({ before: '', after: '' });
    const router = useRouter();

    useEffect(() => {
        if (initialContent){
            setContent(initialContent)
            console.log(content)
        }
    }, [])

    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChangeAf = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.startsWith('@')) {
            setInputUser(true);
            setSplitInput((prev) => ({
                ...prev,
                after: value.slice(1),
            }));
            if(!inputUser) {
                setSplitInput((prev) => ({
                    ...prev,
                    before : "@"
                }))
            }
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } else {
            setSplitInput((prev) => ({
                ...prev,
                after: value,
            }));
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef])

    // `before` 변경 핸들러
    const handleChangeBe = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSplitInput((prev) => ({
            ...prev,
            before: value,
        }));
    };

    useEffect(() => {
        const updatedContent = `${splitInput.before}$%^${splitInput.after}`;
        setContent(updatedContent);
        if (!splitInput.before.startsWith("@")) {
            setInputUser(false)
        }
    }, [splitInput]);

    const goSearch = () => {
        router.push(`/search?content=${content}`)
    }

    return (
        <div className="bg-grayc mb-[60px] px-[10px] py-[5px] rounded-full z-40 flex">
            <span ref={spanRef} className="absolute invisible whitespace-pre text-sm">
                {splitInput.before || '유저 검색'}
            </span>
            {inputUser && (
                <div className="p-[5px] rounded-full bg-blue-600 flex text-sm items-center text-white mr-[10px]">
                    <input
                        placeholder="유저 검색"
                        value={splitInput.before}
                        onChange={handleChangeBe}
                        ref={inputRef}
                        className="bg-transparent focus:outline-none text-white text-sm m-0"
                        style={{
                            width: `${spanRef.current?.offsetWidth || 30}px`,
                            minWidth: '30px',
                        }}
                    />
                </div>
            )}
            <input
                placeholder={inputUser ? "제목 검색" : "@ 로 유저 검색"}
                value={splitInput.after}
                onChange={handleChangeAf}
                className="text-sm bg-transparent focus:outline-none text-white w-[800px]"
            />
            <button
                onClick={goSearch}
                className='hover:bg-gray-700 p-[10px] rounded-full duration-200'
            >
                <img src="/icons/search.svg" alt="search icon" className='w-[15px]'/>
            </button>
        </div>
    );
};

export default Search;
