import { Button } from '@/components/ui/button'

function Header() {
  return (
    <div className='p-2 shadow-sm justify-between items-center px-5 flex'>
        <img src='/logo.svg'/>
        <div>
            <Button>Sign in </Button>
        </div>
    </div>
  )
}

export default Header