import { Link } from 'react-router-dom';

const NotFoundScreen = () => {
  return (
    <div className='not-found'>
      {/* Зірки */}
      <div className='stars'>
        {[...Array(80)].map((_, i) => (
          <div key={i} className='star' style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            width: `${1 + Math.random() * 2.5}px`,
            height: `${1 + Math.random() * 2.5}px`,
          }} />
        ))}
      </div>

      {/* Планета */}
      <div className='nf-planet' />

      {/* Контент */}
      <div className='nf-content'>
        <div className='nf-astronaut-wrap'>
          {/* SVG Астронавт */}
          <svg className='nf-astronaut' viewBox='0 0 200 260' fill='none' xmlns='http://www.w3.org/2000/svg'>
            {/* Тіло скафандру */}
            <ellipse cx='100' cy='160' rx='52' ry='62' fill='#ececec' />
            {/* Живіт — панель */}
            <rect x='72' y='148' width='56' height='36' rx='10' fill='#d0c8ff' />
            <circle cx='88' cy='163' r='5' fill='#8C52FE' opacity='0.7'/>
            <circle cx='100' cy='163' r='5' fill='#FC904F' opacity='0.8'/>
            <circle cx='112' cy='163' r='5' fill='#8C52FE' opacity='0.7'/>
            <rect x='88' y='174' width='24' height='4' rx='2' fill='#8C52FE' opacity='0.5'/>
            {/* Шолом */}
            <ellipse cx='100' cy='96' rx='42' ry='44' fill='#e0e0e0' />
            <ellipse cx='100' cy='96' rx='32' ry='34' fill='#1a0a3a' />
            {/* Відблиск шолому */}
            <ellipse cx='88' cy='82' rx='10' ry='7' fill='white' opacity='0.15' transform='rotate(-20 88 82)' />
            {/* Відображення у візорі */}
            <ellipse cx='100' cy='96' rx='22' ry='23' fill='url(#visor)' opacity='0.6' />
            <defs>
              <radialGradient id='visor' cx='40%' cy='35%'>
                <stop offset='0%' stopColor='#8C52FE' stopOpacity='0.5'/>
                <stop offset='100%' stopColor='#1a0a3a' stopOpacity='0'/>
              </radialGradient>
            </defs>
            {/* Шия */}
            <rect x='84' y='136' width='32' height='16' rx='6' fill='#d0d0d0' />
            {/* Ліва рука */}
            <ellipse cx='48' cy='158' rx='16' ry='24' fill='#e0e0e0' transform='rotate(15 48 158)' />
            <circle cx='40' cy='178' r='10' fill='#d0d0d0' />
            {/* Права рука */}
            <ellipse cx='152' cy='158' rx='16' ry='24' fill='#e0e0e0' transform='rotate(-15 152 158)' />
            <circle cx='160' cy='178' r='10' fill='#d0d0d0' />
            {/* Ліва нога */}
            <ellipse cx='82' cy='218' rx='14' ry='22' fill='#d8d8d8' />
            <ellipse cx='80' cy='236' rx='14' ry='8' fill='#c8c8c8' />
            {/* Права нога */}
            <ellipse cx='118' cy='218' rx='14' ry='22' fill='#d8d8d8' />
            <ellipse cx='120' cy='236' rx='14' ry='8' fill='#c8c8c8' />
            {/* Рюкзак */}
            <rect x='64' y='130' width='72' height='50' rx='10' fill='#c8c4e8' />
            <rect x='72' y='136' width='56' height='38' rx='8' fill='#d8d4f0' />
            {/* Тросик */}
            <path d='M160 178 Q190 150 185 110' stroke='#FC904F' strokeWidth='2.5' fill='none' strokeDasharray='5 4' strokeLinecap='round'/>
            {/* Зірочка в руці */}
            <polygon points='185,100 188,110 198,110 190,116 193,126 185,120 177,126 180,116 172,110 182,110' fill='#FC904F' opacity='0.9'/>
          </svg>
        </div>

        <div className='nf-text'>
          <h1 className='nf-404'>404</h1>
          <h2 className='nf-title'>Загубились у космосі</h2>
          <p className='nf-subtitle'>
            Схоже, ця сторінка відлетіла на іншу орбіту.<br/>
            Але ми знайдемо для вас правильний шлях!
          </p>
          <Link to='/' className='nf-btn'>
            ← Повернутись на головну
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundScreen;
