import { observer } from "mobx-react-lite";
import Link from "next/link";


const Header = () => {
    return (
       <div className="header">
            <Link href={"/login"}>Регистрация</Link>
            <Link href={"/signup"}>Авторизация</Link>
       </div>
    )
}

export default Header;