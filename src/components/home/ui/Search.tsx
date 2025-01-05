'use client'
import { before } from 'node:test';
import React, { useState, useRef, useEffect } from 'react';

const Search = () => {
    const [content, setContent] = useState('');
    const [inputUser, setInputUser] = useState(false);
    const [splitInput, setSplitInput] = useState({ before: '', after: '' });

    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChangeAf = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitInput((prev) => ({
            ...prev, // 이전 상태를 복사
            after: e.target.value, // 변경할 값만 덮어쓰기
        }));
    };

    const handleChangeBe = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitInput((prev) => ({
            ...prev, // 이전 상태를 복사
            before: e.target.value, // 변경할 값만 덮어쓰기
        }));
    };

    useEffect(() => {
        setContent()
    })

    useEffect(() => {
        if (content.startsWith('@') && !inputUser) {
            setInputUser(true);

            if (inputRef.current) {
                inputRef.current.focus();
            }

            const index = content.indexOf(' ');
            if (index !== -1) {
                setContent(content.slice(0, index + 1) + '$%^' + content.slice(index + 1));
            } else {
                setContent(content + '$%^');
            }
        } else if (!content.startsWith('@') && inputUser) {
            setContent((prevContent) => prevContent.replace('$%^', ''));
            setInputUser(false);
        }

        // `$%^`로 분리
        const parts = content.split('$%^');
        setSplitInput({
            before: parts[0] || '',
            after: parts[1] || '',
        });
    }, [content, inputUser]);

    return (
        <div className="bg-grayc mb-[60px] px-[20px] py-[10px] rounded-full sticky top-[6px] z-40 flex">
            <span
                ref={spanRef}
                className="absolute invisible whitespace-pre"
            >
                {splitInput.before || '유저 검색'}
            </span>
            {inputUser && (
                <div className="p-[5px] rounded-full bg-blue-600 flex items-center text-white">
                    <input
                        placeholder="유저 검색"
                        value={splitInput.before}
                        onChange={handleChangeBe}
                        ref={inputRef}
                        className="bg-transparent focus:outline-none text-white text-sm ml-[5px]"
                        style={{
                            width: `${spanRef.current?.offsetWidth || 50}px`,
                            minWidth: '50px',
                        }}
                    />
                </div>
            )}
            <input
                placeholder="여기서 검색..."
                value={splitInput.after}
                onChange={handleChangeAf}
                className="text-lg bg-transparent focus:outline-none text-white w-[800px]"
            />
        </div>
    );
};

export default Search;
