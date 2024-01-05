import Logo from '../assets/IItlogo.png'

const Banner = () => {
    return (
        <div>
            <div className="bg-black">
                <div className="text-white text-2xl p-4 flex flex-row gap-2">
                    <img src={Logo} alt='IITJ Logo' className='w-12' />
                    <a href="https://iitj.ac.in/" className='pl-4 pt-2'>Indian Institute of Technology Jodhpur</a>
                </div>
            </div>
        </div>
    )
}

export default Banner