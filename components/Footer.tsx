import React from "react";
import { Mail, Linkedin, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        
        {/* Sección de Logo/Marca */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 mb-8 md:mb-0">
          <h4 className="text-2xl font-bold">Simulador financiero 🏦</h4>
          <p className="text-sm text-gray-400 max-w-xs">
            Tu herramienta financiera para simular ahorros e inversiones de manera inteligente.
          </p>
        </div>

        {/* Contenedor principal de columnas del footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Columna de Legal */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Legal</h4>
            <div className="space-y-2">
              <details className="text-gray-300">
                <summary className="cursor-pointer hover:text-blue-400 transition-colors">
                  Términos y Condiciones
                </summary>
                <div className="mt-2 pl-4 text-sm max-w-md mx-auto md:mx-0">
                  <p className="mb-2">
                    Última actualización: {new Date().toLocaleDateString("en-GB")}
                  </p>
                  <div className="space-y-2">
                    <p>1. Esta aplicación no guarda información personal.</p>
                    <p>2. Todos los listados de propiedades son solo con fines de demostración.</p>
                    <p>3. Los usuarios son responsables de verificar toda la información de las propiedades de forma independiente.</p>
                    <p>4. No garantizamos la exactitud de la información mostrada.</p>
                    <p>5. Al utilizar esta plataforma, usted reconoce que:</p>
                    <ul className="list-disc pl-4 mt-2">
                      <li>Esta es una plataforma de demostración</li>
                      <li>No se procesan transacciones reales</li>
                      <li>No se recopilan ni almacenan datos de usuarios</li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Columna de Contacto */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Contacto</h4>
            <a 
              href="mailto:leandro.moren18@gmail.com?subject=Consulta%20desde%20la%20página%20web"
              className="flex items-center justify-center md:justify-start text-gray-300 hover:text-blue-400 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              <span>Enviar un mail</span>
            </a>
          </div>

          {/* Columna de Redes Sociales */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Redes Sociales</h4>
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <a
                href="https://www.linkedin.com/in/leandromoren/"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://x.com/leamorenn"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;