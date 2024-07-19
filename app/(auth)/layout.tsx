import React, { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='relative flex h-screen w-full flex-col items-center justify-center'>
            <div className=''>{children}</div>
        </div>
    )
}

export default layout