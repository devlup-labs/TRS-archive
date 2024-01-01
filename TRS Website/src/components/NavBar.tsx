import Logo from '../assets/IItlogo.png'
import DropInput from './DropInput'

const Navbar = () => {
    return (
        <div className="bg-red-600 flex flex-row justify-between">
            <div>
                <img src={Logo} alt='TRS' className='w-20 p-4' />
            </div>
            <div className='pr-4 flex flex-col'>
                <a href='#' className='pl-[350px] mb-[4px]'>Login</a>
                <div className='flex flex-row gap-1'>
                    <input type='text' placeholder='Search' className='text-md border border-black' />
                    <DropInput />
                    <button>search</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar