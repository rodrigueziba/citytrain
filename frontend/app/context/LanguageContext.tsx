'use client';
import React, { createContext, useContext, useState } from 'react';

const translations = {
  es: {
    nav_reservas: "Reservas",
    nav_nosotros: "Nosotros",
    nav_servicios: "Servicios",
    nav_contacto: "Contacto",
    hero_subtitle: "Una hora de un viaje",
    hero_highlight: "I-NOL-VI-DA-BLE",
    about_title_1: "Sobre",
    about_title_2: "Nosotros",
    about_text: "Somos una empresa familiar, que ofrece a los turistas que llegan a Ushuaia casi una hora de viaje por la ciudad. Brindamos a quienes visitan la ciudad más austral del mundo un recorrido por sus calles, paisajes e historias en tren.",
    services_title_1: "Nuestros",
    services_title_2: "Servicios",
    srv_tour_title: "City Tour",
    srv_tour_text: "13 kilómetros de mucha historia, paisaje e información. ¡Te esperamos para que tengas la mejor vista de Ushuaia!",
    srv_benefits_title: "Beneficios Exclusivos",
    srv_benefits_text: "Por viajar en nuestro Ushuaia City Train, obtenés un 10% de descuento en la entrada del Museo Marítimo de Ushuaia (Ex Presidio).",
    srv_stats_title: "El Recorrido",
    srv_stats_text: "4 Salidas Diárias • 13 Kilómetros de Viaje • 1 Hora de Recorrido.",
    contact_title: "Contacto",
    contact_text: "¿Tenés alguna duda especial para grupos grandes o eventos? Estamos para ayudarte.",
    btn_email: "Enviar un Email",
    btn_whatsapp: "Hablar por WhatsApp",
    
    book_title: "Armá tu Viaje",
    book_date: "¿Cuándo viajás?",
    book_date_ph: "Seleccioná una fecha",
    book_time: "Horario",
    book_passengers: "Pasajeros",
    book_name: "Nombre Completo",
    book_email: "Email",
    book_method: "Método de Pago",
    book_total: "Total final:",
    book_btn_mp: "Pagar con MercadoPago",
    book_btn_transfer: "Confirmar Reserva",
    book_btn_load: "Procesando...",
    book_success: "¡Reserva Recibida!",
    book_success_sub: "Para confirmar tu lugar, realizá la transferencia y enviá el comprobante por WhatsApp.",
    book_btn_send_voucher: "Enviar comprobante por WhatsApp"
  },
  en: {
    nav_reservas: "Booking",
    nav_nosotros: "About Us",
    nav_servicios: "Services",
    nav_contacto: "Contact",
    hero_subtitle: "An hour of an",
    hero_highlight: "UN-FOR-GET-TA-BLE trip",
    about_title_1: "About",
    about_title_2: "Us",
    about_text: "We are a family business offering tourists arriving in Ushuaia an almost one-hour journey through the city. We provide those visiting the southernmost city in the world a tour of its streets, landscapes, and history by train.",
    services_title_1: "Our",
    services_title_2: "Services",
    srv_tour_title: "City Tour",
    srv_tour_text: "13 kilometers of rich history, landscapes, and information. We await you to experience the best view of Ushuaia!",
    srv_benefits_title: "Exclusive Benefits",
    srv_benefits_text: "By traveling on our Ushuaia City Train, you get a 10% discount on admission to the Ushuaia Maritime Museum (Ex Presidio).",
    srv_stats_title: "The Journey",
    srv_stats_text: "4 Daily Departures • 13 Kilometers • 1 Hour Tour.",
    contact_title: "Contact Us",
    contact_text: "Do you have any special requests for large groups or events? We are here to help.",
    btn_email: "Send an Email",
    btn_whatsapp: "Chat on WhatsApp",
    
    book_title: "Book your Trip",
    book_date: "When are you traveling?",
    book_date_ph: "Select a date",
    book_time: "Schedule",
    book_passengers: "Passengers",
    book_name: "Full Name",
    book_email: "Email",
    book_method: "Payment Method",
    book_total: "Final total:",
    book_btn_mp: "Pay with MercadoPago",
    book_btn_transfer: "Confirm Booking",
    book_btn_load: "Processing...",
    book_success: "Booking Received!",
    book_success_sub: "To confirm your spot, please make the bank transfer and send the receipt via WhatsApp.",
    book_btn_send_voucher: "Send receipt via WhatsApp"
  },
  pt: {
    nav_reservas: "Reservas",
    nav_nosotros: "Sobre Nós",
    nav_servicios: "Serviços",
    nav_contacto: "Contato",
    hero_subtitle: "Uma hora de uma viagem",
    hero_highlight: "I-NES-QUE-CÍ-VEL",
    about_title_1: "Sobre",
    about_title_2: "Nós",
    about_text: "Somos uma empresa familiar que oferece aos turistas que chegam a Ushuaia quase uma hora de viagem pela cidade. Proporcionamos a quem visita a cidade mais austral do mundo um passeio por suas ruas, paisagens e histórias de trem.",
    services_title_1: "Nossos",
    services_title_2: "Serviços",
    srv_tour_title: "City Tour",
    srv_tour_text: "13 quilômetros de muita história, paisagens e informações. Esperamos você para ter a melhor vista de Ushuaia!",
    srv_benefits_title: "Benefícios Exclusivos",
    srv_benefits_text: "Ao viajar no nosso Ushuaia City Train, você ganha 10% de desconto na entrada do Museu Marítimo de Ushuaia (Ex Presídio).",
    srv_stats_title: "O Percurso",
    srv_stats_text: "4 Saídas Diárias • 13 Quilômetros de Viagem • 1 Hora de Duração.",
    contact_title: "Contato",
    contact_text: "Tem alguma dúvida especial para grupos grandes ou eventos? Estamos aqui para ajudar.",
    btn_email: "Enviar um E-mail",
    btn_whatsapp: "Falar pelo WhatsApp",
    
    book_title: "Monte sua Viagem",
    book_date: "Quando você viaja?",
    book_date_ph: "Selecione uma data",
    book_time: "Horário",
    book_passengers: "Passageiros",
    book_name: "Nome Completo",
    book_email: "E-mail",
    book_method: "Método de Pagamento",
    book_total: "Total final:",
    book_btn_mp: "Pagar com MercadoPago",
    book_btn_transfer: "Confirmar Reserva",
    book_btn_load: "Processando...",
    book_success: "Reserva Recebida!",
    book_success_sub: "Para confirmar seu lugar, faça a transferência e envie o comprovante pelo WhatsApp.",
    book_btn_send_voucher: "Enviar comprovante pelo WhatsApp"
  }
};

type Language = 'es' | 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['es']) => string;
  tCategory: (name: string) => string; // NUEVO TIPO
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  // Traducción general
  const t = (key: keyof typeof translations['es']) => {
    return translations[language][key] || translations['es'][key];
  };

  // NUEVO: Traductor inteligente para los pasajes de la base de datos
  const tCategory = (name: string) => {
    if (language === 'es') return name; // En español dejamos el de la DB intacto

    const nameLower = name.toLowerCase();

    // Diccionario de palabras clave
    const categoryDict = {
      en: {
        'jubilado': 'Retiree',
        'nacional': 'National Tourist',
        'extranjero': 'Foreign Tourist',
        'turista': 'Tourist',
        'menor': 'Child',
        'residente': 'Local Resident'
      },
      pt: {
        'jubilado': 'Aposentado',
        'nacional': 'Turista Nacional',
        'extranjero': 'Turista Estrangeiro',
        'turista': 'Turista',
        'menor': 'Criança',
        'residente': 'Residente Local'
      }
    };

    // Buscamos si el nombre de la DB contiene alguna de las palabras clave
    for (const [key, translation] of Object.entries(categoryDict[language])) {
      if (nameLower.includes(key)) {
        return translation;
      }
    }

    // Si no encuentra nada, devuelve el nombre original
    return name;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tCategory }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage debe usarse dentro de un LanguageProvider");
  return context;
};