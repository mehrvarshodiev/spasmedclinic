import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ArrowDown, ArrowRight, CalendarDays, CheckCircle2, Clock3, HeartPulse, Instagram, MapPin, Menu, MessageCircle, Phone, ShieldCheck, Sparkles, Stethoscope, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { services } from './data/services'

const phone = '+7 (XXX) XXX-XX-XX'
const schema = z.object({
  name: z.string().trim().min(2, 'Введите имя (не менее 2 символов)').max(80, 'Слишком длинное имя'),
  phone: z.string().trim().regex(/^[+\d()\-\s]{7,20}$/, 'Проверьте номер телефона'),
  service: z.string().min(1, 'Выберите услугу'),
  date: z.string().min(1, 'Выберите удобную дату'),
  consent: z.boolean().refine(Boolean, 'Необходимо согласие на обработку данных')
})
type FormValues = z.infer<typeof schema>
const today = () => { const d = new Date(); return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-') }

function BookingForm({ selected = '' }: { selected?: string }) {
  const [status, setStatus] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema), defaultValues: { name: '', phone: '', service: selected, date: '', consent: false }
  })
  const submit = async (values: FormValues) => {
    setStatus('')
    try {
      const response = await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      if (!response.ok) throw new Error('Запись пока не подключена. Пожалуйста, свяжитесь с клиникой по телефону.')
      setStatus('Заявка отправлена. Администратор свяжется с вами для подтверждения.')
      reset()
    } catch {
      setStatus('Онлайн-отправка пока не подключена. Пожалуйста, свяжитесь с клиникой по телефону или мессенджеру.')
    }
  }
  return <form className="grid gap-4" onSubmit={handleSubmit(submit)} noValidate>
    <div><label className="field-label">Ваше имя</label><input className="field" placeholder="Как к вам обращаться" autoComplete="name" {...register('name')} />{errors.name && <small className="error">{errors.name.message}</small>}</div>
    <div><label className="field-label">Телефон</label><input className="field" placeholder="+7 ___ ___-__-__" inputMode="tel" autoComplete="tel" {...register('phone')} />{errors.phone && <small className="error">{errors.phone.message}</small>}</div>
    <div><label className="field-label">Услуга</label><select className="field" {...register('service')}><option value="">Выберите услугу</option>{services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select>{errors.service && <small className="error">{errors.service.message}</small>}</div>
    <div><label className="field-label">Желаемая дата</label><input className="field" type="date" min={today()} {...register('date')} />{errors.date && <small className="error">{errors.date.message}</small>}</div>
    <label className="consent"><input type="checkbox" {...register('consent')} /><span>Согласен(на) на обработку персональных данных в соответствии с <a href="/privacy" onClick={e => { e.preventDefault(); alert('Добавьте утверждённую политику конфиденциальности по адресу /privacy.') }}>политикой конфиденциальности</a>.</span></label>{errors.consent && <small className="error">{errors.consent.message}</small>}
    {status && <p className="form-status" role="status">{status}</p>}
    <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Отправляем…' : <>Записаться <ArrowRight size={18}/></>}</button>
    <p className="text-xs leading-relaxed text-slate-500">Отправка формы не подтверждает запись. Время визита согласовывается с администратором.</p>
  </form>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const openBooking = (service = '') => { setSelectedService(service); setModalOpen(true); setMenuOpen(false) }
  const closeBooking = () => setModalOpen(false)
  return <div>
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label="SpasMed — на главную"><span className="brand-mark"><HeartPulse size={25}/></span><span>Spas<span>Med</span><small>КЛИНИКА ЗДОРОВЬЯ</small></span></a>
        <nav className="desktop-nav"><a href="#about">О клинике</a><a href="#services">Услуги</a><a href="#doctor">Специалист</a><a href="#contacts">Контакты</a></nav>
        <div className="header-actions"><a className="header-phone" href="tel:+70000000000"><Phone size={16}/>{phone}</a><button className="btn btn-primary header-cta" onClick={() => openBooking()}>Записаться</button><button className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
      </div>
      {menuOpen && <nav className="mobile-nav">{[['О клинике','#about'],['Услуги','#services'],['Специалист','#doctor'],['Контакты','#contacts']].map(([label,href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<button className="btn btn-primary" onClick={() => openBooking()}>Записаться на приём</button></nav>}
    </header>

    <main>
      <section id="home" className="hero">
        <div className="container hero-grid">
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.55}}>
            <span className="hero-pill"><span className="pulse-dot"/> Внимание к человеку и его самочувствию</span>
            <h1>Здоровье начинается<br/>с <span>внимательного</span><br/>отношения к вам</h1>
            <p className="hero-copy">SpasMed — пространство для консультаций, заботы о здоровье и индивидуального подхода к каждому пациенту.</p>
            <div className="hero-actions"><button className="btn btn-primary" onClick={() => openBooking()}>Записаться на консультацию <ArrowRight size={18}/></button><a className="btn btn-light" href="#services">Наши услуги <ArrowDown size={17}/></a></div>
            <div className="hero-points"><span><ShieldCheck/> Индивидуальный подход</span><span><HeartPulse/> Внимание к безопасности</span></div>
          </motion.div>
          <div className="hero-art" aria-label="Иллюстрация медицинской помощи">
            <div className="art-orb orb-one"/><div className="art-orb orb-two"/>
            <div className="art-card card-top"><span className="art-icon"><Activity/></span><span><b>В центре внимания</b><small>Ваше самочувствие</small></span></div>
            <div className="medical-illustration"><div className="ill-circle"><Stethoscope size={92} strokeWidth={1.2}/></div><span className="ill-cross">+</span><span className="ill-spark"><Sparkles/></span></div>
            <div className="art-card card-bottom"><span className="art-icon gold-icon"><CheckCircle2/></span><span><b>Осознанный подход</b><small>Обсуждаем варианты помощи</small></span></div>
            <span className="hero-caption">SPASMED · CARE WITH ATTENTION</span>
          </div>
        </div>
        <div className="hero-bottom"><div className="container hero-bottom-inner"><span><span className="bottom-symbol">01</span> Сначала выслушаем</span><span><span className="bottom-symbol">02</span> Обсудим возможные шаги</span><span><span className="bottom-symbol">03</span> Согласуем план вместе</span></div></div>
      </section>

      <section id="about" className="section"><div className="container about-grid"><div><span className="eyebrow">О клинике</span><h2 className="section-title">Медицинская помощь начинается с диалога</h2><p className="body-copy">Мы стремимся создать спокойную атмосферу, где можно открыто рассказать о самочувствии, задать вопросы и обсудить возможные варианты дальнейших действий.</p><p className="body-copy">Каждая ситуация индивидуальна. Рекомендации и процедуры должны учитывать состояние человека, показания и противопоказания.</p><a href="#contacts" className="text-link">Связаться с клиникой <ArrowRight size={17}/></a></div><div className="about-panel"><div className="about-icon"><HeartPulse size={34}/></div><h3>Внимание к каждому</h3><p>Понятные объяснения, уважительное отношение и открытый разговор на каждом этапе обращения.</p><div className="about-divider"/><div className="about-feature"><CheckCircle2/><span><b>Понятная информация</b><small>Обсуждаем варианты без обещаний гарантированного результата.</small></span></div><div className="about-feature"><CheckCircle2/><span><b>Решения с учётом пациента</b><small>Методы и показания уточняются на консультации.</small></span></div></div></div></section>

      <section id="services" className="section services-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Направления работы</span><h2 className="section-title">Услуги клиники</h2><p className="body-copy">Выберите направление, чтобы уточнить детали и обсудить, подходит ли оно вам.</p></div><span className="heading-deco"><Stethoscope size={42}/></span></div><div className="services-grid">{services.map((service, i) => <motion.article key={service.id} className="card service-card" initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{delay:i*.05}}><div className="service-top"><span className="service-icon">{[<HeartPulse/>,<Activity/>,<Sparkles/>,<ShieldCheck/>,<Stethoscope/>,<Clock3/>][i]}</span><span className="service-number">0{i+1}</span></div><h3>{service.title}</h3><p>{service.description}</p><div className="service-price">{service.price}</div><button className="service-link" onClick={() => openBooking(service.id)}>Уточнить и записаться <ArrowRight size={16}/></button></motion.article>)}</div><p className="disclaimer">Перечень услуг и цены необходимо подтвердить у клиники. Показания, ограничения и ожидаемые результаты обсуждаются со специалистом.</p></div></section>

      <section id="doctor" className="section founder-section"><div className="container founder-grid">
        <motion.div className="founder-photo-wrap" initial={{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{duration:.5}}>
          <div className="founder-photo-frame">
            <div className="founder-photo-placeholder" role="img" aria-label="Место для фотографии Мухаммаджона Алламуродова">
              <div className="founder-photo-monogram">MA</div>
              <span className="founder-photo-label">Фотография основателя</span>
              <small>Замените этот блок на фото из профиля Instagram</small>
            </div>
          </div>
          <div className="founder-photo-caption"><span className="founder-caption-dot"/><span>SpasMed <i>·</i> SinoMed</span></div>
        </motion.div>
        <motion.div className="founder-content" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.5,delay:.08}}>
          <span className="eyebrow">Основатель клиники</span>
          <h2 className="section-title">Мухаммаджон <span className="founder-surname">Алламуродов</span></h2>
          <p className="founder-role">Основатель и генеральный директор <strong>SpasMed</strong> и <strong>SinoMed</strong></p>
          <p className="body-copy founder-description">Врач с международной практикой и ведущий специалист клиники. В своей работе уделяет внимание индивидуальному подходу, открытому диалогу и понятному обсуждению возможных вариантов помощи.</p>
          <div className="founder-principle"><span className="founder-principle-icon"><HeartPulse size={20}/></span><p>«В центре медицинской помощи всегда должен быть человек»</p></div>
          <div className="founder-actions">
            <a className="btn btn-primary" href="tel:+79773284422"><Phone size={18}/> Запись к врачу / Консультация <ArrowRight size={17}/></a>
            <a className="btn btn-whatsapp" href="https://wa.me/79773284422" target="_blank" rel="noreferrer"><MessageCircle size={19}/> Написать в WhatsApp <ArrowRight size={16}/></a>
          </div>
          <div className="founder-socials">
            <span className="founder-socials-label">Следите за нами</span>
            <div className="founder-social-links">
              <a href="https://www.instagram.com/doctor.muhammadjonmoscow/" target="_blank" rel="noreferrer" aria-label="Instagram Мухаммаджона Алламуродова"><Instagram size={18}/><span>@doctor.muhammadjonmoscow</span><ArrowRight size={14}/></a>
              <a href="https://www.instagram.com/spasmed_clinic/" target="_blank" rel="noreferrer" aria-label="Instagram клиники SpasMed"><Instagram size={18}/><span>@spasmed_clinic</span><ArrowRight size={14}/></a>
            </div>
          </div>
        </motion.div>
      </div></section>

      <section className="section reviews-section"><div className="container review-inner"><div className="review-mark">“</div><span className="eyebrow">Открытость и доверие</span><h2 className="section-title">Ваш опыт важен</h2><p className="body-copy">Здесь можно разместить реальные отзывы пациентов с их разрешения, а также видеоотзывы. До получения подтверждённых материалов мы не публикуем вымышленные отзывы и оценки.</p><div className="review-placeholder"><MessageCircle/><span>Место для подтверждённых отзывов</span></div></div></section>

      <section id="appointment" className="section booking-section"><div className="container booking-grid"><div className="booking-copy"><span className="eyebrow">Запись на приём</span><h2 className="section-title">Давайте подберём удобное время</h2><p>Оставьте контактные данные и желаемую дату. Администратор должен связаться с вами для подтверждения записи.</p><div className="booking-benefit"><CalendarDays/><span><b>Удобная дата</b><small>Выберите предпочтительный день визита.</small></span></div><div className="booking-benefit"><MessageCircle/><span><b>Уточнение деталей</b><small>Услуга и время согласуются отдельно.</small></span></div></div><div className="card booking-card"><h3>Заявка на консультацию</h3><p>Поля со звёздочкой обязательны.</p><BookingForm selected={selectedService}/></div></div></section>

      <section id="contacts" className="section contacts-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Как нас найти</span><h2 className="section-title">Контакты SpasMed</h2><p className="body-copy">Перед публикацией замените демонстрационные данные на официальные контакты клиники.</p></div></div><div className="contacts-grid"><div className="card contact-card"><span className="contact-icon"><MapPin/></span><h3>Адрес клиники</h3><p>Укажите точный адрес в Москве</p><span className="contact-muted">Карта появится после подтверждения адреса.</span></div><div className="card contact-card"><span className="contact-icon"><Phone/></span><h3>Телефон</h3><p>{phone}</p><span className="contact-muted">Замените номер на актуальный</span></div><div className="card contact-card"><span className="contact-icon"><Clock3/></span><h3>Время работы</h3><p>По предварительной записи</p><span className="contact-muted">Уточните график у администратора</span></div></div><div className="contact-cta"><div><h3>Остались вопросы?</h3><p>Свяжитесь с клиникой по официальным каналам.</p></div><button className="btn btn-primary" onClick={() => openBooking()}>Оставить заявку <ArrowRight size={17}/></button></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-top"><a className="brand footer-brand" href="#home"><span className="brand-mark"><HeartPulse size={24}/></span><span>Spas<span>Med</span><small>КЛИНИКА ЗДОРОВЬЯ</small></span></a><p>Внимательное отношение к здоровью начинается с разговора.</p><nav><a href="#about">О клинике</a><a href="#services">Услуги</a><a href="#contacts">Контакты</a></nav></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} SpasMed. Все права защищены.</span><a href="/privacy" onClick={e => { e.preventDefault(); alert('Разместите здесь утверждённую политику обработки персональных данных.') }}>Политика конфиденциальности</a><span>Информация на сайте не заменяет медицинскую консультацию.</span></div></footer>

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) closeBooking() }}><motion.div className="modal card" role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{opacity:0,y:16,scale:.98}} animate={{opacity:1,y:0,scale:1}}><button className="modal-close" aria-label="Закрыть" onClick={closeBooking}><X/></button><span className="eyebrow">Запись на приём</span><h2 id="modal-title">Оставить заявку</h2><p className="body-copy">Заполните форму, чтобы обсудить удобное время визита.</p><BookingForm key={selectedService} selected={selectedService}/></motion.div></div>}
  </div>
}