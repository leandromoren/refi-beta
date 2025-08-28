import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Legal</h4>
            <div className="space-y-2">
              <details className="text-gray-300">
                <summary className="cursor-pointer hover:text-blue-400 transition-colors">
                  Términos y Condiciones
                </summary>
                <div className="mt-2 pl-4 text-sm">
                  <p className="mb-2">
                    Última actualización: {new Date().toLocaleDateString("en-GB")}
                  </p>
                  <div className="space-y-2">
                    <p>1. Esta aplicación no guarda información personal.</p>
                    <p>
                      2. Todos los listados de propiedades son solo con fines de
                      demostración.
                    </p>
                    <p>
                      3. Los usuarios son responsables de verificar toda la
                      información de las propiedades de forma independiente.
                    </p>
                    <p>
                      4. No garantizamos la exactitud de la información
                      mostrada.
                    </p>
                    <p>5. Al utilizar esta plataforma, usted reconoce que:</p>
                    <ul className="list-disc pl-4">
                      <li>Esta es una plataforma de demostración</li>
                      <li>No se procesan transacciones reales</li>
                      <li>No se recopilan ni almacenan datos de usuarios</li>
                    </ul>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Contacto</h4>
            <div className="text-gray-300 space-y-2">
              <a href="mailto:leandro.moren18@gmail.com?subject=Asunto%20predefinido&body=Hola,%20me%20gustaría%20preguntarte%20más%20sobre%20la%20aplicación">
                leandro.moren18@gmail.com
              </a>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Seguíme en mis redes</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/leandromoren/"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                target="_blank"
              >
                Linkedin
              </a>
              <a
                href="https://x.com/leamorenn"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                target="_blank"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
