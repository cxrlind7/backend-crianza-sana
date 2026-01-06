const blogs = [
    {
        id: 1,
        title: "Mamá y pediatra",
        description:
            "Hola, soy la Doctora Miriam Cervantes, mamá y pediatra. En esta primera entrada de mi blog quiero compartirles cómo estas dos facetas de mi vida, aunque parecen complementarse, me han enseñado lecciones muy distintas. La maternidad, con todos sus retos y momentos de amor infinito, me ha permitido ser una pediatra más empática y cercana a las familias que confían en mí.",

        text: `Esta es mi primera vez escribiendo un Blog y sinceramente el primer tema que se me vino a la mente fue compartir mi experiencia como mamá y pediatra.
            <br>
            <br>
            Ser mamá y pediatra es una de las experiencias más enriquecedoras y, al mismo tiempo más desafiantes que he vivido. Como profesional de la salud, siempre he procurado ofrecer el mejor cuidado a los niños, que para mí son lo más importante, y aunque mis conocimientos médicos me dan una gran seguridad en el ámbito laboral, ser madre me ha enseñado que la teoría no siempre se aplica igual en la práctica cuando se trata de tus propios hijos. 
            <br>
            <br>
            Soy mamá de 5… Ángela una adolescente hermosa y desafiante, dos ángeles en el cielo que no llegaron a nacer, Néstor un niño sensible y con altas capacidades… y Darío el torbellino más carismático del mundo.
            <br>
            <br>
            Ser madre no debe ser tarea fácil para ninguna mujer, existe siempre el miedo o la duda de si estamos haciendo lo correcto por nuestros hijos. En mi caso esos miedos iniciaron desde el mismo momento en que me enteraba de la existencia de un pequeño ser creciendo en mi cuerpo. Debo decir que no existe otra etapa en la vida en la que haya estado más consciente de cada sensación y cambio en mí. Los bebés que están en el cielo me dejaron con una profunda tristeza y culpa; pensando una y otra vez si había hecho algo mal o si me había faltado hacer algo.
            <br>
            <br>
            Ya había dicho que la maternidad es difícil y es que con cada uno de mis hijos he sentido esa angustia y esa vulnerabilidad que posiblemente no he experimentado en ninguna otra situación. Mis hijos me han enseñado muchísimo, pero lo más importante es a ser una pediatra empática. Cada que llega al consultorio una mamá llena de preocupaciones que, muchas veces yo también tengo en casa, de inmediato me acuerdo de estas noches eternas, sentada al borde de la cama con un bebé en el pecho sintiendo cansancio e inquietud, dudando de mis capacidades como mujer y aún más como pediatra.
            <br>
            <br>
            Ser pediatra no me convierte en una supermamá, sino en una madre más que experimenta angustia cuando su hijo está enfermo o tiene algún pequeño accidente. La diferencia es que, en mi caso, las herramientas para entender lo que pasa están a la mano, además de contar con la enorme fortuna de tener a mi lado un esposo cirujano pediatra que no solo aporta conocimientos médicos sino la tranquilidad del sistema de apoyo que todo padre debe ser.
            <br>
            <br>
            En alguna ocasión me han dicho… debe ser fácil ser pediatra de tus hijos, la realidad es que no puedo tener la misma objetividad que tengo con mis pacientes. De ahí que logro entender lo que sienten las mamás que acuden a mis consultas, esa razón nublada por el amor infinito que le tenemos a los hijos.
            <br>
            <br>
            Como pediatra, trato de ser la mejor guía para las familias que confían en mí, pero como madre, me doy cuenta de que la mayor lección que me ha dado la maternidad es la paciencia, la empatía, y la aceptación de que no siempre hay respuestas fáciles, que lo que funcionó con un hijo no siempre se va a poder aplicar al otro.
            <br>
            <br>
            Ser mamá y pediatra me da la posibilidad de cuidar de forma diferente a mis hijos, tal vez con mayores conocimientos pero también me deja el saber que puedo ser una mamá imperfecta como cualquier otra y comprender los miedos que todas tenemos en este camino que es maternar.`,
        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BlogMamaPediatra.jpeg", // Imagen del blog
        category: "Pediatría",

        categoryColor: "#1e4588", // Color del fondo de la categoría
        author: {
            name: "Dra. Miriam Cervantes",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/MiriamCervantes1.jpg", // Imagen del autor
        },
        date: "15-01-2025",
    }, {
        id: 2,
        title: "Blue Monday",
        description:
            "¿Es real el 'Blue Monday', el lunes más triste del año? Explora el origen de este concepto, cómo influye en nuestras emociones y descubre consejos prácticos para superar la nostalgia post-fiestas y empezar el año con ánimo renovado.",

        text: `El <strong>“Blue Monday”</strong> se celebra el tercer lunes de enero. En el presente año, este día se conmemora el 20 de enero. Sin embargo, esta conmemoración tiene un mensaje oculto:
            <br>
            <br>
            El famoso “Blue Monday” fue determinado por el psicólogo Cliff Arnall, donde (supuestamente) a través de una fórmula matemática que tenía en cuenta ciertos factores como: el clima, las deudas generadas por las fiestas decembrinas, la añoranza de las terminadas vacaciones, el restablecimiento de la rutina y la falta de motivación en relación a los propósitos fijados para el año nuevo.
            <br>
            <br>
            La teoría carece de sustento científico, ya que no es aplicable para todos los contextos y todos los países, sin embargo, ganó bastante popularidad e influencia en la vida cotidiana, en especial para temas de marketing y ventas, aprovechando la promoción de productos o servicios como solución a la tristeza inducida.
            <br>
            <br>
            Es normal sentir nostalgia por el término de las vacaciones, el clima frío y un gran número de factores. Sin embargo, te comparto una serie de recomendaciones que pueden ayudar a que tu estado de ánimo mejore terminado el periodo decembrino:
            <br>
            <br>
            1. <strong>Ejercicio:</strong> La práctica de actividad física favorece la liberación de endorfinas, conocidas por su efecto positivo en el estado de ánimo y su capacidad para generar sensaciones de bienestar.
            <br>
            <br>
            2. <strong>Socialización:</strong> El tiempo compartido con seres queridos, como amigos y familiares, brinda apoyo emocional y puede contribuir a elevar el ánimo.
            <br>
            <br>
            3. <strong>Planificación de actividades:</strong> Programar eventos o actividades recreativas futuras proporciona algo que esperar, lo cual puede ser útil para superar momentos de tristeza.
            <br>
            <br>
            4. <strong>Cuidado personal</strong> Realizar actividades relajantes, como la meditación, el yoga, o una cita con tu psicólogo de confianza, puede ayudar a reducir el estrés y fomentar una mejora en el bienestar general.
            <br>
            <br>
            Recuerda <strong>no creer todo lo que ves en internet</strong>, cuestionar toda información que consultamos y, sobre todo, depurar qué noticias y contenidos consumimos, ya que impactan en nuestros procesos cognitivos del cómo entendemos el mundo exterior.`,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BlogBlueMonday.jpeg", // Imagen del blog
        category: "Psicología",

        categoryColor: "#1a9fad", // Color del fondo de la categoría
        author: {
            name: "Psic. Luis A. Galván",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/Luis1.jpg", // Imagen del autor
        },
        date: "15-01-2025",
    }, {
        id: 3,
        title: "Mi pasión y vocación.",
        description:
            `¡Hola! Mi nombre es Carina Lares. Aunque generalmente no uso mi segundo apellido, desde que aprendí que el apellido materno representa abundancia, he decidido presentarme de nuevo: soy Carina Lares Cervantes.
            <br>
            <br>
            En esta primera entrada de mi blog, quiero compartirles cómo mi historia personal y mi vocación por el desarrollo integral de los niños y niñas han definido quién soy y lo que hago.`,

        text: `¡Hola! Mi nombre es Carina Lares; generalmente no utilizo mi segundo apellido, pero desde que me dijeron que usar el apellido materno es importante porque representa la abundancia; me presento de nuevo; mi nombre es: Carina Lares Cervantes. 
        <br>
        <br>
        A través de este blog quiero que conozcan un poco de mi y de como nació mi pasión y vocación por el desarrollo integral de los niños y niñas.
        <br>
        <br>
        Mi infancia no fue fácil; les cuento somos 7 hermanos donde papá y mamá tenían que trabajar ambos para ofrecernos un mejor porvenir; así que la crianza fue con tintes de los estilos negligente  y/o autoritario; (y no es juzgar a mis padres, los honro y amo, entiendo que nos educaron con los recursos que tenían en ese momento);  en nuestra dinámica familiar los hermanos mayores se hacían cargo de los más pequeños; además de esto agréguenle que mi maestra de primaria era castrante y violenta, y para colmo fue mi maestra los tres primeros años de mi educación primaria (vaya suerte la mía); creo que de ahí nació mi interés de conocer  más sobre el desarrollo infantil y defender lo que yo consideraba eran nuestros derechos; cuando era pequeña y estaba en primaria participé con una disertación acerca de los derechos de los niños y niñas, recuerdo que mi tema fue: ¨Lo que admiro de mis padres¨ el cual hacia referencia de la importancia de una buena crianza  y como esta influía  para bien o para mal en la vida de los niños y niñas; quizá era muy pequeña para entender el concepto concreto de la crianza; sin embargo mi intuición me decía que los niños deberíamos ser protegidos, tratados con respeto y amor; no me gustaban las injusticias y me la pasaba cuestionado y confrontando  a los adultos cuando  a mi parecer trataban mal a los niños y niñas,  (ya se imaginaran como me iba cuando cuestionaba  a mi señora madre al momento que algo me parecía injusto), vienen a mi mente varios momentos en los cuales fui testigo de la violencia que se ejercía con quien eran mis compañeros de escuela y obvio yo me manifestaba en contra y pues así me iba a mi también; había de todo: golpes, castigos y violencia emocional como por ejemplo: saltar nuestro nombre al momento de pasar lista de asistencia eso se sentía como si no existiéramos,  como anular nuestra persona, es algo que definitivamente deja marcas en la autoestima de un niño; otros de los momentos que tengo muy presente fue cuando estaba en un centro comercial con mis hermanos mayores conversando, cuando de repente vi a una mujer maltratando a un niño, (ahí ya era estudiante de la universidad) el cual estaba haciendo una rabieta tirado en  el piso, la mujer en cuestión le quito el cinturón y amenazo con pegarle, algo dentro de mi me hizo levantarme rapidísimo y me dirigí  hacia ellos; tome al niño del brazo y lo levante del piso y le dije a quien suponía era su mamá; ¨No le pegue, así no se trata a un niño¨  claro que me arriesgue que la mamá se hubiera puesto agresiva conmigo; afortunadamente no lo hizo, solo me dijo: ¨es que no me hace caso¨; por esto y muchas experiencias más donde se veía comprometido el bienestar de los niños y niñas; entendí que si se requiere que nos preparemos para desempeñar el papel más importante: ser papás;  la formación de un  nuevo ser humano requiere todos nuestros sentidos y un alto nivel de conciencia; en pleno siglo XXI ya no es valido  decir que: ¨nadie nos enseño a ser papás¨; ya no es posible que tengamos niños emocionales criando niños. 
        <br>
        <br>
        En la actualidad soy fundadora y directora de D-kids. Centro de Desarrollo Infantil donde ofrecemos servicio de guardería a niños y niñas en su primera infancia, atención en terapia de lenguaje, terapia de aprendizaje y conducta a niños y niñas neurotípicos y/o neurodivergentes desde hace ya 9 años.; lo cual me ha permitido tener acercamiento con los padres de familia y distinguir los diferentes estilos de crianza (democrático, permisivo, negligente y autoritario).
        <br>
        <br>
        Desde muy pequeña sabia que me dedicaria a propteger a las infancias, no queria que nadie mas pasara por injusticias, humillaciones, abandono u omisiones en los cuidados, me aterraba pensar que un niño y/o niña, pudiese estar siendo violentado y que nadie hiciera nada por ellos. De ahí nace mi vocación y empece a preparame para estudiar sobre el desarrollo de los niños y niñas; como piensan, que sienten, y como impactan los diferentes estilos de crianza en su vida, ademas que creo que tengo ángel para hacer conexión con ellos. Estoy convencida que la primera infancia es crucial para el desarrollo saludable de las personas y que es obligación de los cuidadores primarios y secundarios; protegerlos, amarlos y respetarlos en su individualidad, consideremos que cada actuar o palabra que venga de sus cuidadores para los niños y/o niñas será determinante en la forma que perciban al mundo; y en como se relacionan con el y donde se asentaran las bases para su desarrollo emocional, social y cognitivo. 
        <br>
        <br>
        Si tu papá o mamá o cuidadores; me estan leyendo y te das cuenta que la crianza que estas llevado acabo hasta este momento no es beneficiosa para formar a un ser humano sano y feliz; ¡detente! reflexiona en tu actuar, modifica tu estilo de crianza; busca ayuda e informate. Crianza Sana By D-kids es un espacio hecho para ti pero pensado en las niños y niñas de este planeta; lo único que tu hijo espera recibir de ti es: cuidado, protección y amor. 
        <br>
        <br>
        Hasta aquí dejare mi primer blog; esten atentos del siguiente, ahí les contaré como nacio el proyecto de Crianza Sana by Dkids. ¡Hasta pronto!
        `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/CarinaBlog1.jpeg", // Imagen del blog
        category: "Terapia cognitivo-conductual",

        categoryColor: "#ff83bf", // Color del fondo de la categoría
        author: {
            name: "Carina Lares Cervantes",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/CarinaLares1.jpg", // Imagen del autor
        },
        date: "24-01-2025",
    }, {
        id: 4,
        title: "De niña curiosa a nutrióloga apasionada: Mi viaje por la nutrición",
        description:
            `Hola, soy Silvia Andrea Soria Díaz, y quiero compartir un pedacito de mi historia con ustedes.
            Soy hija, hermana, esposa y nutrióloga, roles que han dado forma a mi vida de manera
            indescriptible.

A los 19 años, la vida me puso a prueba lo que moldeó mi enfoque y mi filosofía
como nutrióloga, reforzando mi convicción de que la nutrición es fundamental para la salud y
el bienestar de cada persona.`,

        text: `Hola, soy Silvia Andrea Soria Díaz, y quiero compartir un pedacito de mi historia con ustedes.
            Soy hija, hermana, esposa y nutrióloga, roles que han dado forma a mi vida de manera indescriptible. Desde muy pequeña, el fascinante mundo de la salud capturó mi atención, y no fue mucho después cuando decidí que mi destino estaba en esta hermosa profesión.
                    <br>
        <br>
            A los 19 años, la vida me puso a prueba con una enfermedad delicada que requirió de la atención de muchos médicos. De cada uno de ellos, aprendí lecciones valiosas: cómo ser, y cómo no ser, como profesional de la salud. Esas experiencias moldearon mi enfoque y mi filosofía como nutrióloga, reforzando mi convicción de que la nutrición es fundamental para la salud y el bienestar de cada persona.
                    <br>
        <br>
            No tengo ninguna duda de que la nutrición no solo es vital, sino también maravillosa en su aplicación diaria. Es por esto que creé <strong>Cambiando Hábitos Nutrición</strong>, con la intención de ayudar a la población a lograr sus metas de nutrición de manera sostenible. A lo largo de mis diez años de experiencia, he tenido el privilegio de presenciar transformaciones increíbles en personas que adoptan hábitos alimenticios más saludables. Sin embargo, lo que más me llena el corazón es trabajar con niños y sus familias. Enseñarles a desarrollar buenos hábitos alimenticios y ver cómo estos se reflejan en su salud es una recompensa invaluable.
                    <br>
        <br>
            Recuerdo el caso de un pequeño que llegó a mi consulta con problemas de peso y baja autoestima. Trabajamos juntos, él y su familia, estableciendo un plan alimenticio adecuado y fomentando hábitos saludables. Con el tiempo, no solo mejoró su salud, sino que también floreció su confianza y alegría. Historias como esta son las que me motivan cada día a seguir adelante en este camino.
                    <br>
        <br>
            Cada niño que he conocido es una chispa de esperanza y energía, y sus logros son el testimonio viviente del poder de la nutrición. Mi misión es seguir guiando a las familias y a sus pequeños en su viaje hacia una vida más saludable y feliz.
                    <br>
        <br>
            Gracias por acompañarme en este recorrido. ¡Sigamos construyendo un mundo donde la nutrición sea una prioridad y cada persona pueda alcanzar su máximo potencial!
                    <br>
        <br>
            Con cariño, tu nutriologa Silvia Andrea Soria Díaz.`,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/andreablog1.jpeg", // Imagen del blog
        category: "Nutrición",

        categoryColor: "#7abb4b", // Color del fondo de la categoría
        author: {
            name: "Silvia Andrea Soria Díaz",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/AndreaSoria1.jpg", // Imagen del autor
        },
        date: "29-01-2025",
    }, {
        id: 5,
        title: "Fluoruro y la prevención de caries.",
        description:
            `El fluoruro es un mineral clave en la odontología por su capacidad para fortalecer el esmalte y prevenir la caries. Su presencia en el agua potable y en pastas dentales ha demostrado ser efectiva para reducir el riesgo de desmineralización dental. Sin embargo, su uso debe ser adecuado, ya que el exceso puede provocar fluorosis. En este blog, exploramos sus beneficios, recomendaciones de uso y desmitificamos algunos mitos sobre su impacto en la salud. `,

        text: `El fluoruro es uno de los componentes más investigados en odontología debido a su papel en la prevención de caries. Se encuentra combinado en la naturaleza y representa el 0.065% de la corteza terrestre. Su relación con la caries se descubrió en 1899 en Italia y en 1901 en EE.UU., cuando se observó que el flúor presente en el agua causaba alteraciones en el esmalte dental, conocidas como fluorosis, pero también brindaba resistencia a la caries.
                            <br>
        <br>
            El fluoruro actúa en la prevención de caries al inhibir la desmineralización del esmalte, promover su remineralización e inhibir el metabolismo bacteriano. La cantidad recomendada en el agua es de 0.7 ppm, con un máximo permitido de 1.5 ppm según la OMS. La ingesta diaria en zonas con concentraciones óptimas es de aproximadamente 1 mg.
                    <br>
        <br>
            La toxicidad del fluoruro ha sido ampliamente estudiada; la dosis letal es de 5 a 10 gramos. Sin embargo, la exposición prolongada a altas concentraciones puede causar problemas óseos, fluorosis dental, y en casos extremos, daño en órganos como ojos, piel y pulmones.
                    <br>
        <br>
            El uso de flúor en pastas dentales se aprobó en 1961 por la ADA, ya que se demostró su efectividad en la prevención de caries. Se recomienda el cepillado dos veces al día durante 2 minutos, usando cantidades según la edad:
            <ul>
            <li>6 meses a 3 años: pasta con +1000 ppm de flúor, tamaño de un grano de arroz.</li>
            <li>3 a 6 años: pasta con 1000 ppm, tamaño de un chícharo.</li>
            <li>6 años o más: pasta con 1450 ppm, tamaño de un chícharo. Siempre debe haber supervisión de un adulto.</li>
            </ul>
            El mito sobre la calcificación de la glándula pineal por fluoruro carece de evidencia sólida. La glándula se endurece naturalmente con la edad, acumulando fosfato y flúor. Para mitigar este proceso, se recomienda controlar los niveles de vitamina D y evitar la exposición excesiva a pantallas para regular la producción de melatonina.
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/PatiBlog1.png", // Imagen del blog
        category: "Odontopediatría",

        categoryColor: "#e70885", // Color del fondo de la categoría
        author: {
            name: "Patricia Peña Raigosa",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/PatriciaPena1.jpg", // Imagen del autor
        },
        date: "29-01-2025",
    }, {
        id: 6,
        title: "Mi Viaje en la Terapia de Comunicación Humana.",
        description:
            `En este blog encontrarás un lugar dedicado al acompañamiento en el desarrollo de la comunicación humana. Compartiré recursos, consejos y reflexiones basados en mi experiencia como terapeuta, con el objetivo de apoyar tanto a profesionales como a familias en el proceso de rehabilitación del lenguaje, la voz, el habla, la audición y más. `,

        text: `
            <span style="float: left; color: #169eac; font-weight: bold; font-size: 5rem; line-height: 4rem; height: 2.6rem; text-transform: uppercase;">H</span>
            <span style="color: #169eac;">ola hola a todos/as, soy Bianca Macias </span><span>y me dedico a acompañar a las personas en su proceso de rehabilitación en la comunicación. Desde que realice mi residencia en el centro de atención a la comunidad de mi alma mater Fpytch UJED me convencí de que me apasiona mi carrera Lic. Terapia de la Comunicación Humana y sinceramente no me decido por una sola área de especialización... les cuento rápidamente que no solo enseñamos "la R", vemos muchas patologías dentro de la comunicación, pero ciertamente la atención privada con un enfoque clínico es lo mío. </span>
        <br>
        <br>
            <span>Desde pequeña, cuando me preguntaban qué quería ser de grande, siempre respondía que maestra o psicóloga. Sin embargo, fue al descubrir mi carrera como terapeuta en comunicación humana que me enamoré completamente de su labor. </span><span style="color: #169eac;">El poder acompañar a las personas en su desarrollo y ayudarles a superar los desafíos relacionados con el lenguaje, la voz, el habla, la audición, la deglución y el aprendizaje me llenó de satisfacción y propósito.</span>
        <br>
        <br>
            Esta pasión me llevó a trabajar desde guardería, centros psicopedagógicos, asociaciones y siempre en algún consultorio privado, con amigos y diferentes colegas. Así mismo trabaje fuera de Durango, lo cual fue un gran reto para mi y donde aprendí mucho, de verdad mucho, jamás había tenido tantos casos clínicos en mis manos y lista de espera, acababa muerta al final del día, pero sin duda me curtió en todo tipo de patologías ya que me obligó a ser más profesional y estudiar más y más...
                    <br>
        <br>
            Por lo cual me intereso especializarme con una Maestría en Educación Especial, la cual cursé en línea,  esto me permitió ser más sensible en mis tratamientos hacia personas con discapacidad y neurodiversidad.
        <br>
        <br>
            <span style="color: #169eac; font-style: italic;">Mi enfoque se basa en una atención respetuosa, personalizada y adaptada a las necesidades de cada persona. Trabajo de manera multisensorial, </span> <span>involucrando diferentes sentidos para hacer que el proceso terapéutico sea más eficaz y enriquecedor. Cada sesión es única, porque cada persona es única, y mi objetivo es siempre crear un espacio seguro y confiable donde se puedan lograr avances significativos en la comunicación.</span>
                    <br>
        <br>
            Ya por último quiero compartirles una de mis frases favoritas de un autor base de mi formación, y que siempre le comparto a mis alumnos universitarios:
            <div style="text-align: center;">
            <span style="color: #169eac; font-size: 1.4rem; font-style: italic;">
                "El niño empieza a percibir el mundo no solo a través de sus ojos sino también a través de su habla"
            </span>
            <span style="font-weight: bold; font-size: 1.2rem;">
                — Vygotsky
            </span>
            </div>
            A través de este blog, compartiré recursos, consejos y reflexiones que espero te ayuden en tu propio camino hacia una mejor comunicación. Y si alguna vez sientes que necesitas acompañamiento, estaré aquí para ayudarte en lo que necesites. Hagamos equipo en tu rehabilitación o la de tu peque. 💜✨️
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BiancaBlog1.jpeg", // Imagen del blog
        category: "Terapia de lenguaje",

        categoryColor: "#b475ec", // Color del fondo de la categoría
        author: {
            name: "Bianca Macías",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BiancaMacias1.jpg", // Imagen del autor
        },
        date: "03-02-2025",
    }, {
        id: 7,
        title: "Historia y Cuidado Dental: Celebrando el Día del Odontólogo 🦷",
        description:
            `En este blog exploramos la evolución de la odontología, desde sus inicios en civilizaciones antiguas hasta la Odontología de Mínima Intervención. También hablamos sobre la importancia de la prevención y el cuidado bucal. Como odontopediatra, mi compromiso es crear un ambiente seguro para los niños y educar a las familias sobre hábitos saludables. ✨`,

        text: `
            <h2>✨ La Belleza de la Sonrisa a Través del Tiempo</h2>
            <p>Desde la antigüedad, el ser humano ha buscado mejorar su sonrisa. En el año 3000 a.C., los egipcios utilizaban incrustaciones de piedras preciosas en los dientes como símbolo de belleza y estatus. Los mayas también incorporaban piedras y oro en sus piezas dentales, no solo por restauración, sino también como un signo de atractivo y prestigio.</p>
            <h2>🦷 ¿Por qué se Celebra el Día del Odontólogo el 9 de Febrero?</h2>
            <p>En México, el Día del Odontólogo se celebra cada 9 de febrero en honor a estos profesionales de la salud bucal. La fecha está vinculada a Santa Apolonia, mártir del siglo III, quien sufrió la extracción forzada de sus dientes por su fe cristiana. Se dice que aquellos que padecían dolor de muelas invocaban su nombre para obtener alivio. Es por esto que es reconocida como la patrona de los dentistas.</p>
            <h2>📜 La Evolución de la Odontología</h2>
            <p>En sus inicios, la odontología se enfocaba en aliviar el dolor dental con métodos invasivos y rudimentarios. Los barberos realizaban extracciones dentales y cirugías menores, ya que la especialización aún no existía. Con el avance de la ciencia, la odontología moderna nació en el siglo XVII y en el siglo XVIII, Lucy Hobbs Taylor se convirtió en la primera mujer en graduarse como odontóloga en Estados Unidos.</p>
            <img src="https://csdkids-images.s3.us-east-2.amazonaws.com/IMG_2386.JPG" alt="Odontología" style="display: block; margin: auto; max-width: 100%; height: auto;">
            <p>Hoy en día, la Odontología de Mínima Intervención permite tratamientos más eficaces, menos invasivos y con mayor comodidad para los pacientes.</p>
            <h2>🦷 Hábitos para una Sonrisa Saludable</h2>
            <ul>
                <li>✔ Cepillado dental al menos tres veces al día con pasta fluorada.</li>
                <li>✔ Uso de hilo dental y enjuague bucal diariamente.</li>
                <li>✔ Dieta balanceada, reduciendo el consumo de azúcares.</li>
                <li>✔ Revisiones odontológicas periódicas para prevención y detección temprana de problemas.</li>
            </ul>
            <h2>💙 Mi Compromiso con la Odontopediatría</h2>
            <p>Desde 2003, como odontopediatra, mi enfoque ha sido crear un ambiente cálido y seguro para los niños, brindando confianza a los padres. Educo a las familias sobre la importancia de la prevención y la formación de hábitos saludables desde la infancia.</p>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/PatriciaPena1.jpg", // Imagen del blog
        category: "Odontopediatría",

        categoryColor: "#e70885", // Color del fondo de la categoría
        author: {
            name: "Patricia Peña Raigosa",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/PatriciaPena1.jpg", // Imagen del autor
        },
        date: "09-02-2025",
    },
    {
        id: 8,
        title: "Cuidados del Recién Nacido: La Importancia de los Primeros 28 Días de Vida",
        description:
            `En este blog exploramos la importancia de los primeros 28 días de vida del bebé, desde la adaptación a su nuevo entorno hasta los cuidados esenciales para su bienestar. Hablamos sobre la lactancia materna, el contacto piel con piel, la higiene del recién nacido y el control de niño sano.`,

        text: `
            <h2>¿Qué es un recién nacido?</h2>
            <p>Es un bebé desde el nacimiento hasta los primeros 28 días de vida. Durante este período, el bebé se adapta a la vida fuera del útero y sus sistemas orgánicos maduran.</p>
            <h2>¿Por qué hablar de los cuidados del Recién Nacido?</h2>
            <p>El periodo neonatal es cuando existe mayor tasa de mortalidad infantil. Buscamos incrementar el conocimiento, las habilidades y la autoconfianza de las madres, familias y cuidadores de recién nacidos, concientizar y fomentar la toma de decisiones asertivas para reducir la mortalidad infantil.</p>
            <h2>Primera hora del nacimiento: La hora dorada</h2>
            <ul>
                <li><strong>Corte tardío del cordón umbilical:</strong> Entre 1-3 minutos después del nacimiento para permitir la transfusión de sangre desde la placenta al bebé, mejorando sus reservas de hierro.</li>
                <li><strong>Contacto piel con piel:</strong> Favorece el reconocimiento de sonidos, voces, regulación de temperatura y facilita el inicio de la lactancia materna.</li>
                <li><strong>Iniciar lactancia materna:</strong> Al estar piel con piel, el bebé inicia la succión al seno materno.</li>
            </ul>
            <h2>Intervenciones posteriores a la primera hora de vida</h2>
            <p>Se inician revisiones pediátricas, aplicación de vitamina K, aseo ocular, mediciones e identificación del bebé. Se recomienda retrasar el primer baño hasta después de 24 horas.</p>
            <h2>Higiene del cordón umbilical y de la piel</h2>
            <p>El cordón umbilical debe mantenerse limpio y seco, sin colocar sustancias. La piel del bebé contiene sustancias que lo protegen contra infecciones, por lo que se recomienda no aplicar perfumes ni productos adicionales.</p>
            <h2>Control de niño sano durante la primera semana de vida</h2>
            <ul>
                <li>Valorar el establecimiento de la lactancia materna.</li>
                <li>Vigilar coloración de la piel (ictericia).</li>
                <li>Progreso del peso (pueden perder hasta el 7% del peso con el que nacieron).</li>
                <li>Revisión del cordón umbilical.</li>
                <li>Realización de tamizajes médicos.</li>
                <li>Resolución de dudas y mitos sobre los cuidados del bebé.</li>
            </ul>
            <p>La <strong>OMS</strong> recomienda tramitar el acta de nacimiento ante el Registro Civil para comprobar la existencia del bebé en la sociedad.</p>
            <h3>Dra. Miriam Cervantes Huerta</h3>
            <h6>Pediatra y Cardióloga Pediatra</h6>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/miriamBlog2.jpg", // Imagen del blog
        category: "Pediatría",

        categoryColor: "#1e4588", // Color del fondo de la categoría
        author: {
            name: "Miriam Cervantes",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/MiriamCervantes1.jpg", // Imagen del autor
        },
        date: "11-02-2025",
    },
    {
        id: 9,
        title: "Nutrición y Epilepsia: Una Guía para Padres y Cuidadores",
        description:
            `La epilepsia es un trastorno neurológico que afecta a millones de niños en todo el mundo. En este blog exploramos la relación entre la nutrición y el control de las convulsiones, abordando la importancia de una alimentación equilibrada, la dieta cetogénica y la suplementación nutricional.`,

        text: `
            <p>La epilepsia es un trastorno neurológico que afecta a millones de personas en todo el mundo, incluyendo a muchos niños. La relación entre la nutrición y la epilepsia ha sido objeto de estudio durante años, y se ha demostrado que una dieta adecuada puede jugar un papel crucial en el manejo de esta condición.</p>
            <h3>La Importancia de una Dieta Equilibrada</h3>
            <p>Una dieta equilibrada es fundamental para el bienestar general de cualquier niño, pero es especialmente crucial para aquellos con epilepsia. Los nutrientes esenciales, como las vitaminas y los minerales, juegan un papel importante en el funcionamiento del sistema nervioso y pueden ayudar a reducir la frecuencia y severidad de las convulsiones.</p>
            <h3>La Dieta Cetogénica</h3>
            <p>La implementación de la dieta cetogénica ha demostrado ser efectiva en el control de las convulsiones en niños con epilepsia refractaria. Esta dieta es alta en grasas, moderada en proteínas y muy baja en carbohidratos. Al cambiar la fuente principal de energía del cuerpo a las grasas en lugar de los carbohidratos, se producen cetonas, que tienen efectos anticonvulsivos.</p>
            <h3>Implementación de la Dieta Cetogénica</h3>
            <p>Es esencial que la dieta cetogénica sea supervisada por un equipo de salud, incluyendo a un nutriólogo, para asegurar que se cumplan los requisitos nutricionales y se minimicen los efectos secundarios. Algunos consejos prácticos para su implementación incluyen:</p>
            <ul>
                <li>Crear un plan de comidas que incluya alimentos ricos en grasas saludables como el aguacate, el aceite de coco y los frutos secos.</li>
                <li>Realizar controles médicos regulares para monitorear los niveles de cetonas y asegurar que la dieta esté funcionando correctamente.</li>
                <li>Proporcionar educación y apoyo continuo a los padres y cuidadores sobre la preparación de alimentos y la adherencia a la dieta.</li>
            </ul>
            <h3>Suplementación Nutricional</h3>
            <p>Además de una dieta equilibrada, algunos niños con epilepsia pueden beneficiarse de suplementos nutricionales específicos. Por ejemplo, los suplementos de magnesio y vitamina B6 se han asociado con una reducción de las convulsiones en algunos casos. Es importante consultar con un profesional de la salud antes de iniciar cualquier suplementación para asegurar la dosificación adecuada y evitar interacciones con medicamentos anticonvulsivos.</p>
            <h3>Hidratación y Epilepsia</h3>
            <p>La deshidratación puede ser un desencadenante de convulsiones en algunos niños con epilepsia. Es importante asegurarse de que el niño consuma suficiente agua a lo largo del día para mantener el equilibrio electrolítico y apoyar el funcionamiento óptimo del sistema nervioso.</p>
            <h3>Conclusión</h3>
            <p>La relación entre la nutrición y la epilepsia es compleja, pero con el enfoque adecuado, la dieta puede ser una herramienta poderosa en el manejo de esta condición. Como nutriólogos, nuestro objetivo es proporcionar estrategias nutricionales personalizadas que no solo ayuden a controlar las convulsiones, sino que también mejoren la calidad de vida de los niños y sus familias.</p>
            <p>Si tienes preguntas o necesitas apoyo en la implementación de estas recomendaciones, no dudes en escribirme.</p>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/karenBlog2.JPG", // Imagen del blog
        category: "Nutrición",

        categoryColor: "#7abb4b", // Color del fondo de la categoría
        author: {
            name: "Silvia Andrea Soria Díaz",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/AndreaSoria1.jpg", // Imagen del autor
        },
        date: "12-02-2025",
    },
    {
        id: 10,
        title: "¿Cómo estimular en casa el lenguaje de mi hij@?",
        description:
            `En este blog, exploramos la importancia de la estimulación temprana del lenguaje y los prerrequisitos necesarios para su desarrollo. Destacamos la interacción entre el niño y su entorno como un factor clave, así como la importancia del monitoreo de habilidades motoras para detectar posibles retrasos.`,

        text: `
    <h5 style="font-weight: bold;">Indicadores tempranos o requisitos del desarrollo del lenguaje</h5>
    <p style="color: #333;">Para que se dé la adquisición del lenguaje, debe tenerse en cuenta que este es fruto de un <span style="color: #b475ec; font-weight: bold;">proceso interactivo</span>, donde niño y adulto mantienen una interacción en el comportamiento para llegar a establecer definiciones compartidas de las <span style="color: #b475ec; font-weight: bold;">situaciones</span> y una complicidad creciente.</p>
    <p style="color: #333;">El principal factor a tener en cuenta es el monitoreo de las habilidades motoras, ya que un retraso en la <span style="color: #b475ec; font-weight: bold;">coordinación sensomotriz podría afectar el habla</span> y la marcha. Alrededor de los 12 meses se podrá evidenciar, y también puede ser un indicador de un retraso evolutivo más generalizado.</p>
    <p style="color: #333;">En este sentido, al hablar de <span style="color: #b475ec; font-weight: bold;">intervención temprana</span> en el lenguaje habrá que pensar no tanto en la modificación u optimización del desarrollo de las habilidades lingüísticas, regido por reglas más o menos rígidas (como lo sería en la terapia), sino en la relación de las posibles desviaciones del patrón de crecimiento (como acciones preventivas).</p>
    <h5 style="font-weight: bold;">Por lo tanto, para la estimulación en casa recomiendo...</h5>
    1.  Una intervención de <span style="color: #b475ec; font-weight: bold;">tipo funcional</span> ya que tiene la ventaja de aprovechar las situaciones <span style="text-decoration:underline;">naturales de interacción</span>, facilitando la motivación y el carácter no reglado en que se desarrollan las actividades infantiles.
    <span style="color: #b475ec; font-weight: bold;">Para los niños con un desarrollo "típico" esta interacción bastaría</span>, pero no para aquellos que nacen con una capacidad reducida para aprovechar la estimulación natural, sea por diferentes alteraciones biológicas o razones evolutivas que reflejan la dispersión que existe para cualquier habilidad (por ej. hay personas que dibujan bien y otras no).</p>
    <p>En el lenguaje hay un potencial base que determina si se va a adquirir rápidamente o no y si va a haber dificultades para ello (trastorno). En la adquisición y desarrollo del lenguaje se necesitan dos requisitos: una <span style="color: #b475ec; font-weight: bold; text-decoration:underline;">condición biológica</span> del individuo con función neurológica "normal" y la necesaria estimulación del <span style="color: #b475ec; font-weight: bold; text-decoration:underline;"><span style="color: #b475ec; font-weight: bold; text-decoration:underline;">medio ambiente.</span></p>
    <span style="font-weight: bold;">2. Prerrequisitos del lenguaje:</span>
    <ul style="border-radius: 5px;">
        <li><span style="color: #b475ec; font-weight: bold;">Contacto visual con su madre y/o referentes (2 meses):</span> Seguir con los ojos una sonaja en diferentes direcciones (izquierda-derecha, arriba-abajo, adelante-atrás).</li>
        <li><span style="color: #b475ec; font-weight: bold;">Sonrisa (3 meses):</span> Hacer mímica y gestos simpáticos para causar la risa, por ejemplo: "¿Onta bebé?".</li>
        <li><span style="color: #b475ec; font-weight: bold;">Atención conjunta (6-7 meses):</span> Mirar lo que se le muestra: por ejemplo, "Mira, aquí tengoooooo... ¡una vaca!", usando libros de tela con estímulos visuales.</li>
        <li><span style="color: #b475ec; font-weight: bold;">Esperar su turno (7-8 meses):</span> Permanecer callado cuando su madre habla y luego comenzar a balbucear.</li>
        <li><span style="color: #b475ec; font-weight: bold;">Imitar cosas simples (10 meses):</span> Expresiones como "oh oh se cayó", "ops", "oh no", y uso de onomatopeyas.</li>
        <li><span style="color: #b475ec; font-weight: bold;">Habilidad de señalar</span>.</li>
    </ul>
    <h5 style="color: #b475ec;">Todo esto se desarrolla antes del 1er año de vida. Antes de hablar.</h5>
    <p style="color: #333;">Estas habilidades se trabajarán como indicadores para un buen desarrollo del habla y lenguaje.</p>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BiancaBlog2.jpeg", // Imagen del blog
        category: "Terapia de lenguaje",

        categoryColor: "#b475ec", // Color del fondo de la categoría
        author: {
            name: "Bianca Macías",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BiancaMacias1.jpg", // Imagen del autor
        },
        date: "21-02-2025",
    }, {
        id: 11,
        title: "¿Por qué hablo tanto de disciplina positiva?",
        description:
            "En este blog, exploramos la importancia de la disciplina positiva como una forma de crianza basada en el respeto, el amor y los límites firmes pero amables. Luis, psicólogo infanto-juvenil y educador de familias en disciplina positiva, comparte su historia personal y cómo su experiencia con una crianza basada en el miedo lo llevó a buscar alternativas más saludables.",

        text: `
            <p>Mi nombre es Luis, soy psicólogo infanto-juvenil, pero también educador de familias en Disciplina Positiva por la Positive Discipline Association y si hay algo que me apasiona en mi trabajo, es hablar sobre disciplina positiva. No porque haya crecido con ella, sino porque mi infancia fue todo lo contrario. Como muchos de mi generación, fui educado con los métodos tradicionales: regaños constantes, castigos que parecían interminables y, en más de una ocasión, golpes que justificaban como <i>“por mi bien”</i>.</p>
            <p><span style="color: #169eac; font-weight: bold;">Crecí con miedo.</span> No porque mis padres quisieran hacerme daño, sino porque así les enseñaron que se educaba. Pero ese miedo no me hizo más fuerte ni más obediente, solo me enseñó a callar, a reprimir mis emociones y a moldearme según lo que los demás esperaban de mí. Aprendí que el amor podía ser condicionado, que los errores se pagaban con aislamiento y que para ser “bueno” debía cumplir expectativas ajenas, incluso a costa de mí mismo.</p>
            <p>Con los años, comprendí que esa forma de criar me dejó heridas invisibles:<span style="color: #169eac; font-weight: bold;"> inseguridad, dificultad para expresar lo que siento y un apego ansioso que aún sigo trabajando en terapia.</span> No culpo a mis padres por cómo me criaron; sé que hicieron lo mejor que pudieron con lo que sabían. Pero hoy sé que hay otra manera y te la quiero compartir a ti mamá, papá, cuidador que estas leyendo esto.</p>
            <p>La crianza respetuosa no significa ausencia de límites, ni permisividad. <span style="color: #169eac; font-weight: bold;">Significa criar con el corazón, con la conciencia de que cada palabra y acción deja una huella.</span> Significa entender que educar no es infundir temor, sino enseñar con el ejemplo, con paciencia y con amor.</p>
            <p>Por eso hablo tanto de disciplina positiva. Porque sé lo que es crecer en modo supervivencia, sintiendo que el amor y la aceptación dependen de portarse “bien”. Y porque sé que los niños no deberían vivir así. Merecen ser guiados con respeto, con límites firmes pero amorosos, en un ambiente donde puedan sentirse seguros de ser quienes son, sin miedo a ser rechazados o castigados por equivocarse.</p>
            <p>Hablo de disciplina positiva porque <span style="color: #169eac; font-weight: bold;">creo en un futuro donde los niños crezcan con autoestima, seguridad y confianza. </span>Porque sé que se puede romper el ciclo. Porque me hubiera gustado que alguien me criara desde el respeto y la comprensión, y porque hoy, como profesional, quiero que más familias tengan la oportunidad de hacerlo diferente, confía en mi cuando te digo que hay una manera mas amorosa de hacer tu trabajo como padre/madre y estaré encantado de acompañarte en el proceso. </p>
            <span style="font-weight: bold;">Criar con respeto no es fácil, pero vale la pena. Y nunca es tarde para aprender.</span>
                <div style="text-align: center; margin-top: 20px;">
                    <span style="color: #169eac; font-size: 1.4rem; font-style: italic;">
                        “¿Dónde sacamos la absurda idea de que para que los niños se porten bien, primero debemos hacerlos sentir mal?”
                    </span>
                    <span style="font-weight: bold; font-size: 1.2rem;">
                        — Jane Nelsen
                    </span>
                </div>
            
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/LuisBlog2.jpeg", // Imagen del blog
        category: "Psicología",

        categoryColor: "#1a9fad", // Color del fondo de la categoría
        author: {
            name: "Psic. Luis A. Galván",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/Luis1.jpg", // Imagen del autor
        },
        date: "21-02-2025",
    }, {
        id: 12,
        title: "Fisioterapeuta, porque superhéroe no es un título oficial",
        description:
            `¡Hola! Soy Karen Meraz, mamá de Valentina y fisioterapeuta apasionada. Desde que descubrí esta profesión, supe que quería dedicar mi vida a ayudar a las personas a recuperar su movilidad, aliviar su dolor y mejorar su calidad de vida. Para mí, cada paciente es único y especial, y los atiendo con el mismo cuidado y dedicación que le daría a un miembro de mi familia.`,

        text: `
            <h3>Mi camino en la fisioterapia</h3> <p>Ser fisioterapeuta no es solo mi trabajo, <span style="color: #a64d79; font-weight: bold;">es mi vocación</span>. A lo largo de los años, he tenido el privilegio de acompañar a muchas personas en su proceso de recuperación. Desde lesiones neurológicas y ortopédicas hasta problemas crónicos de movilidad, cada caso me ha enseñado algo nuevo y me ha reafirmado en mi amor por esta profesión. <span style="color: #521307; font-weight: bold;">Me llena de orgullo ver la evolución de mis pacientes y saber que mi trabajo marca una diferencia en sus vidas.</span>🥰</p> <h3>💙 Mi amor por la fisioterapia infantil</h3> <p>Desde joven, supe que quería dedicarme a una profesión que me permitiera ayudar a los demás. La fisioterapia me llamó la atención por la satisfacción personal que me aporta. <strong>Me encanta trabajar con niños</strong>, ver cómo crecen y se desarrollan. Cada niño es único, y disfruto descubrir sus fortalezas y debilidades para encontrar formas de apoyarlos en la superación de sus desafíos.<img src="https://csdkids-images.s3.us-east-2.amazonaws.com/IMG_3181.PNG" alt="Odontología" style="display: block; margin: auto; max-width: 100%; height: auto;"></p> <p>Mi enfoque es <strong>personalizado y centrado en las necesidades individuales de cada paciente</strong>. Por eso, me esfuerzo en crear un ambiente de confianza y comodidad para que puedan alcanzar su máximo potencial.</p> <h3>👩‍👧El equilibrio entre ser mamá y fisioterapeuta</h3> <p>Si bien la fisioterapia es mi pasión, <span style="color: #521307; font-weight: bold;">mi mayor amor es mi hija Valentina.</span> ❤️ Como mamá, sé lo importante que es encontrar el equilibrio entre la vida profesional y familiar. Cada día es un reto, pero también una motivación para seguir creciendo, aprendiendo y dar lo mejor de mí en ambas facetas.</p> <h3>📢 Mi propósito con este blog</h3> <p>Mi objetivo con este blog es compartir mi experiencia, mis conocimientos y ayudar a más padres a lograr una <span style="color: #521307; font-weight: bold; font-family: verdana;">crianza sana.</bold> </p> <p>Si tienes alguna duda o necesitas orientación, estaré feliz de ayudarte. 💜</p>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/karen21.png", // Imagen del blog
        category: "Fisioterapia",

        categoryColor: "#8f0072", // Color del fondo de la categoría
        author: {
            name: "Karen Meraz",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/KarenMeraz1.jpg", // Imagen del autor
        },
        date: "28-02-2025",
    },
    {
        id: 13,
        title: "Emma.",
        title1: "La Luz que inspira el camino de otros.",
        description:
            `Emma es una niña diagnosticada con Síndrome del Neurodesarrollo, Mandíbula, Ojo y Digital (NEDJED), una condición genética ultra-rara con solo siete casos en el mundo. A través de este blog, su madre comparte el camino de diagnóstico, los desafíos médicos y emocionales, y la lucha por obtener respuestas. Su historia es un testimonio de amor, paciencia y la importancia de una red de apoyo en el camino de familias con condiciones poco conocidas.`,

        text: `        
        <div style="text-align: start; margin-top:-5rem;">
        <span style="font-size: 1.4rem; font-style: italic;">
        Todo lo que tengo y todo lo que soy es tuyo, si no es suficiente, me convierto en ello para serlo.          
        </span>
        </div>
        <span style="float: left; font-weight: bold; font-size: 4rem; line-height: 4rem; height: 2.6rem; text-transform: uppercase;">“D</span>
        <span>isculpe tantas preguntas doctor, no soy experta en el tema, solamente soy una mamá en búsqueda de respuestas…” esa ha sido mi frase más usada por los últimos cuatro años. </span>
                <br>
        <br>
        <p>Se estima que la población mundial en 2025 es de 8,231,613,070 habitantes (según la oficina del Censo de Estados Unidos), de los cuáles solamente 7 niños han sido diagnosticados con Síndrome del Neurodesarrollo, Mandíbula, Ojo y Digital (NEDJED).
        El primer caso en el mundo del Síndrome del Neurodesarrollo, Mandíbula, Ojo y Digital del que se tiene conocimiento fue diagnosticado el año 2019. Hasta el momento, se desconoce de casos en adultos y por lo mismo se conoce muy poco sobre el alcance de esta condición. En México, aparece en el año 2022, diagnosticado probablemente por primera vez como tal, en una pequeña saltillense de 2 años de edad.
        <strong>Mi hija Emma.</strong></p>
        <img src="https://csdkids-images.s3.us-east-2.amazonaws.com/BlogEspecial2.png" alt="Odontología" style="display: block; margin: auto; max-width: 100%; height: auto;">
        <h6>Pero, ¿qué es NEDJED?</h6>
        <p>Me gusta explicarlo de la siguiente manera: El Síndrome del Neurodesarrollo, Mandíbula, Ojo y Digital (por sus siglas en inglés NEDJED) es un síndrome genético, catalogado como “Ultra-Raro”, provocado por un ligero cambio de ortografía en el Cromosoma 5Q35, donde todos tenemos una “A”, mi hija tiene una “C”.
        Es de origen <strong>NOVO</strong>, es decir, en este caso, ni mi esposo, nuestra otra hija Rebeca, o yo, tenemos la mutación en nuestro ADN. Esto no es hereditario y no es consecuencia de ningún acto que pudimos haber hecho antes o durante del embarazo, es simplemente Emma.</p>
        <p>Como se nos ha explicado, la aparición del Síndrome del Neurodesarrollo, Mandíbula, Ojo y Digital (NEDJED) en la literatura médica mundial es reciente. No existe aún alguna asociación nacional o internacional del NEDJED lo suficientemente conocida a la que se pudiera recurrir en búsqueda de información o para compartir experiencias vividas y enseñanzas aprendidas, en donde nosotros como padres de una hija, con un diagnóstico reciente, podamos acudir para ser abrazados por la empatía y experiencia de otros padres que se encuentren en la misma situación.</p>
        <p>Esta condición, presenta una amplia variedad de síntomas y diferencias fenotípicas. La mayoría de los pacientes muestran retraso en el desarrollo, que va de leve a grave y a menudo, tienen diferencias de comportamiento. Se sabe que presentan retraso en el desarrollo neurológico, retraso en el habla, pueden llegar a tener comportamiento estereotipado con el autismo u otras características psiquiátricas. De igual manera, se presentan anomalías del desarrollo de la mandíbula, digitales, estenosis pulmonar, cardíaca y gastrointestinal. Algunos pacientes presentan también el síndrome de Noonan. Como podrán ver, las estadísticas no eran nada alentadoras para nuestra pequeña, que en ese momento tenía dos años y medio.</p>
        <p>No nos importó que la cobertura de nuestro seguro no incluyera los estudios necesarios y cada vez nos quedábamos con menos muebles en la sala, electrodomésticos en la cocina, pues lo hacíamos con mucho amor, se organizaron rifas de juguetes y eventos  para recaudar fondos y la respuesta de tanta gente fue sorprendente. No solo logramos reunir el dinero necesario para los estudios, recibimos  mucho más que eso, la solidaridad de nuestros amigos, generó una red de apoyo tan fuertemente unida, que al día de hoy sigue presente.</p>
        <p>Para ese tiempo mientras mi esposo estaba en Estados Unidos, enfrentando la frialdad de la soledad, luchando por encontrar oportunidades para lograr nuestro proyecto de familia, Yo permanecía en México, con la amplia lista de signos y síntomas  presentes en otros pacientes, que debíamos descartar o confirmar en nuestra hija, realizando ambos nuestro mayor esfuerzo, enfocados en un mismo objetivo: la salud de Emma. </p>
        <p>Fue una gran ayuda para mí poder recurrir a los conocimientos médicos de mi padre, que con su característico humor me explicaba con palabras que Yo podía comprender, las funciones básicas del cerebro, la genética y me daba un abrazo cuando solo había que esperar; mi madre como psicóloga, aunque nunca me lo dijo, sé que siempre estuvo al pendiente de mí, analizando mis conductas o comentarios para evitar que cayera en depresión, su calidez y sutileza de llegar a mi casa en el momento exacto para cuidar a las niñas, me daba la oportunidad de tomar una larga ducha. </p>
        <p>Fueron cinco meses de estudios, de citas médicas, de crueles suposiciones que nos hacían pensar en que Emma, nunca iba a poder caminar o hablar, hasta que un día, no hubo más estudios y el informe de los resultados fueron concluyentes: Emma no tiene ninguna anomalía que requiera cirugía o ponga en riesgo su vida. Presenta bajo peso, hipotonía muscular es decir músculos blandos, flácidos y flexibles, razón por la cual batalla para gatear. El 8 de octubre 2022; 22 meses después de su nacimiento, caminó por primera vez. Se aprecia un notorio retraso en su neurodesarrollo y en ocasiones, su ojo izquierdo deja de enfocar correctamente, se le desplaza hacia un lado, algo parecido le ocurre a mi Papá cuando está cansado (me gusta hacerle esa broma a mi padre jajaja)… pero si recordamos, las bajas expectativas que en ese entonces nos brindaban sobre el caso, Emma está perfecta gracias a Dios. Como un detalle curioso, aún no entiendo por qué es vegetariana si su papá y yo amamos comer carne, pero bueno, algún defecto debía de tener mi hija.</p>
        <p>Todas estas buenas noticias representan un alto grado de responsabilidad para nosotros sus padres, el compromiso de continuar apoyándola en su desarrollo. Si las limitaciones propias del síndrome, jamás han mermado su entusiasmo, su voluntad y deseos de superarse, ¿Por qué nosotros como sus padres hemos de hacerlo? No podemos ser egoístas ante las necesidades de nuestra hija y tanto para mí, como para mi esposo, el no entender y desconocer los avances en el mundo de la medicina, no es excusa para no seguir en la búsqueda de opciones.</p>
        <p>Una vez confirmando que su diagnóstico es bueno para la vida, es decir, que su vida no está en riesgo más allá, como lo estaría cualquier niño de su edad, nos planteamos la pregunta: ¿ y ahora… qué sigue?.. . Se nos había dicho que hasta ese momento, no había un tratamiento específico para los niños con NEDJED. Con la fe puesta en la información que encontrábamos en el internet y asesorados por médicos, abogados y personas allegadas de confianza, pusimos nuestra vida y nuestras esperanzas en una maleta y emigramos a los Estados Unidos. Les aseguro que no fue una decisión sencilla, sin embargo cada día confirmamos que fue la correcta. </p>
        <p>Si bien aún estamos bajo un constante estado de incertidumbre, me complace decirles que mi hija Emma hasta el momento de la publicación de éste artículo, no ha encontrado un solo obstáculo que no haya podido superar, algunos  los vence con mayor facilidad que otros, pero todos son resultado del trabajo constante y sobre todo a pesar de su corta edad, por su gran espíritu de nunca dejarse vencer. Estoy segura de que ella entiende el porqué de las terapias, sabe que una buena alimentación le ayuda a mejorar, por eso acompaña siempre sus terapias con una gran sonrisa y entusiasmo, prefiere las frutas y las verduras antes que la carne o comida procesada. Estoy convencida de que Emma comprende lo que su papá y yo hemos dejado atrás y percibe lo que arduamente hemos trabajado para conseguir lo mejor para ella y nuestra familia.  </p>
        <p><strong>Mi esposo y Yo, estamos conscientes de que no influimos en las condicionantes genéticas que originaron en Emma el Síndrome del Neurodesarrollo, Mandíbula, Ojo y Digital (NEDJED), (según lo afirman los médicos especialistas involucrados en el caso), pero sí somos principales partícipes en su desarrollo, manejo y  tratamiento en casa, pero eso se los platicaré más adelante. </strong></p>
        <p>Me despido con una frase de un sobreviviente de la tragedia de Los Andes, que cruzó por su propio pie la cordillera, pues considero que hace referencia y confirma lo importante que son las herramientas que como Madres les entregamos a nuestros hijos: </p>
        <div style="text-align: center; margin-top:-4rem;">
            <span style="color: #3986fd; font-size: 1.4rem; font-style: italic;">
                “Sí, la montaña me enseñó y me quitó muchas cosas, pero fue mi madre, la que me enseñó a entender y a enfrentar a la montaña” 
            </span>
            <span style="font-weight: bold; font-size: 1.2rem;">
                — Dr. Roberto Canessa.
            </span>
            </div>
        `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BlogEspecial1.png", // Imagen del blog
        category: "Colaboración",

        categoryColor: "#F4B400", // Color del fondo de la categoría
        author: {
            name: "Ruth Valdés García",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BlogEspecial1.png", // Imagen del autor
        },
        date: "03-03-2025",
    }, {
        id: 14,
        title: "¿Por qué el gateo es clave para el desarrollo de tu bebé?",
        title1: "...Y ¿Qué pasa si se lo salta?",
        description:
            `En este blog hablamos sobre la importancia del gateo en el desarrollo físico y cognitivo del bebé. Explicamos cómo fortalece los músculos, mejora la coordinación y estimula la percepción espacial. También ofrecemos consejos para fomentar el gateo y qué hacer si el bebé se lo salta. Como padres, nuestro papel es acompañar este proceso con paciencia y amor.`,

        text: `
            <p>En un mundo donde a los bebés se les pone andaderas y otros dispositivos de forma temprana, es de suma importancia saber los beneficios que el gateo nos ofrece como humanos, no solo de bebés sino para toda la vida. Por lo tanto, nos vienen a la mente algunas preguntas:</p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">¿Qué es el gateo?</span>
            <p>El gateo es la forma en que los bebés se mueven apoyando sus manos y rodillas en el suelo. Es un hito importante en el desarrollo cognitivo, emocional y sensorial. Le abre al bebé un mundo de oportunidades para convertirse en un explorador activo.</p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">¿Cuándo debo esperar que mi bebé gatee?</span>
            <p>Alrededor de los 8 meses de vida, un bebé debería tolerar ponerse en posición de pancita al suelo y tratar de utilizar el apoyo en cuatro puntos (brazos y piernas). De ahí, el gateo suele iniciar alrededor de los 9 a 10 meses de vida, recordando que cada bebé tiene ritmos diferentes y que no debemos forzarlo, solo acompañarlo y facilitar el mayor tiempo-suelo posible (es decir, el tiempo que lo dejamos estar sobre el suelo) para que incremente su curiosidad y necesidad de trasladarse a donde algo le llame la atención.</p>
            <img src="https://csdkids-images.s3.us-east-2.amazonaws.com/gateo2.jpg" alt="Odontología" style="display: block;border-radius: 5px; margin: auto; max-width: 100%; height: auto;">
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">¿Cuáles son los beneficios que ofrece el gateo en el desarrollo de un ser humano?</span>
            <p>El gateo no solo es un medio de desplazamiento; es un ejercicio que crea y fortalece uniones neuronales (sinapsis) que mejoran la conexión entre diferentes áreas del cerebro.</p>
            <ul>
            <li><strong>Fortalece músculos y coordinación:</strong> Al gatear, el bebé trabaja la fuerza en todo el cuerpo (cuello al levantar la cabeza para observar alrededor, espalda y abdomen que posteriormente le favorecerán a mantener el equilibrio en posición de pie; piernas que ayudarán a mantener una posición erguida).</li>
            <li><strong>Incrementa el número de conexiones entre los dos hemisferios del cerebro:</strong> Al tener un patrón cruzado (usar brazo derecho con pierna izquierda y viceversa) se fortalecen las conexiones de neuronas entre ambos lados del cerebro, lo que ayudará en el futuro a mejorar habilidades cognitivas como la lectura, la escritura y la concentración… incluso a ser mejores bailarines.</li>
            <li><strong>Estimula la percepción espacial:</strong> Ayuda a los bebés a tener una mejor percepción de su cuerpo y por lo tanto a comprender la distancia, profundidad y ubicación de los objetos; habilidades clave para mejorar su orientación en el espacio. De adultos nos ayuda a tener una mejor ubicación en lugares nuevos.</li>
            <li><strong>Mejora el equilibrio:</strong> Al estimular los sistemas vestibular (ayuda a los bebés a saber dónde está su cabeza y cuerpo) y propioceptivo (ayuda a los bebés a saber dónde están sus diferentes segmentos corporales).</li>
            <li><strong>Desarrolla la coordinación ojo-mano:</strong> Al moverse hacia objetos y agarrarlos, el bebé mejora su destreza manual y visual, una base importante para actividades futuras como escribir o atarse los zapatos.</li>
            <li><strong>Aumenta la confianza y la autonomía:</strong> El bebé es esclavo de la gravedad, atrapado en cualquier lugar donde lo pongas. El gateo le abre las puertas al mundo, descubre que puede desplazarse por sí mismo lo que fortalece su seguridad y curiosidad para explorar el mundo.</li>
            </ul>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">¿Cómo puedo estimular el gateo?</span>
            <p>Al dejar a mi bebé pase tiempo-suelo, propiciamos la curiosidad y la necesidad de desplazarse hacia objetos que le causen interés. Así mismo, debemos colocar juguetes a poca distancia y que le llamen la atención. Situaciones fundamentales son el acompañarlo durante el proceso estando junto a él y celebrando los pequeños logros. Todo esto bajo un ambiente seguro, lleno de amor y cuidados.</p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">¿Y si mi bebé no gatea?</span>
            <p>Es importante recordar que cada bebé se desarrolla a ritmos diferentes y que no debemos comparar a los bebés entre hermanos o con otros niños.</p>
            <p>Algunos bebés pueden saltarse el gateo y pasar directamente a ponerse de pie o caminar. No siempre es un problema, pero debemos fomentar la etapa del gateo al tener al bebé en el suelo, poner objetos que les llamen la atención a su alrededor y disminuir los dispositivos o situaciones que limiten su libre movimiento.</p>
            <p>El gateo no solo prepara a tu bebé para caminar, sino que facilita futuros aprendizajes. Nuestro papel como padres y cuidadores es favorecer esta etapa a través de juego, paciencia y mucho amor.</p>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/gateo1.jpg", // Imagen del blog
        category: "Pediatría",

        categoryColor: "#1e4588", // Color del fondo de la categoría
        author: {
            name: "Miriam Cervantes",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/MiriamCervantes1.jpg", // Imagen del autor
        },
        date: "10-03-2025",
    }, {
        id: 15,
        title: "La importancia de los primeros 1000 días en la salud bucal del bebé.",
        title1: "(Las caries no se heredan, se heredan hábitos de alimentación y de higiene)",
        description:
            `En este blog hablamos sobre la importancia de los primeros 1000 días en la salud bucal del bebé, desde la gestación hasta los dos primeros años. Destacamos el papel de la lactancia materna, la alimentación complementaria y la prevención de hábitos orales que puedan afectar el desarrollo dental. Como odontopediatra, mi compromiso es guiar a las familias para establecer buenos hábitos de higiene y alimentación desde el inicio.`,

        text: `
            Los primeros 1000 días comprenden los 270 días de la gestación y los 365 días del primer y del segundo año del niño.
            <span style="color: #f36e8b; font-weight: bold; font-size: 1rem;">
            Lo más importante para un odontopediatra en éste periodo son todos aquellos hábitos como alimentación, higiene bucal, hábitos orales parafuncionales o perniciosos que pudieran influir en la salud y correcto desarrollo de la cara del niño.
            </span>
            <p>Durante el embarazo las futuras mamás se encuentran en un momento sensible donde podemos ayudarlas en la espera del bebé proporcionando información importante acerca de enfermedades bucales, alimentación del bebé promoviendo la lactancia materna, alimentación complementaria, cómo cuidar la higiene de los dientes del bebé, y que diferentes aspectos son importante para el correcto desarrollo de los huesos de la cara.
                    <br>
        <br>
            En éste momento es importante fortalecer la salud bucal de la madre así como orientar en técnicas para poder establecer una lactancia plena, y los futuros cuidados para  la boca del bebé.
                    <br>
        <br>
            Conocer a la futura mamá nos da la oportunidad de establecer un HOGAR DENTAL donde todas sus dudas puedan ser resueltas, y crear ese ambiente ideal para acompañarlos en estas primeras etapas tan importantes y decisivas donde crearemos juntos hábitos de alimentacion y de higiene bucal que nos permitirán una vida libre de caries, y una sonrisa perfecta.
            </p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">Alimentación durante los primeros 1000 días del bebé.</span>
            <p>Es fundamental la alimentación de la madre durante el periodo de gestación tanto para el correcto desarrollo del bebé, como para la correcta formación de los dientes del futuro niño. Los dientes de leche comienzan su formación alrededor de la 5ª semana de vida intrauterina, es por esto que recomendamos un adecuado aporte nutricional con vitaminas A, D y C. porteínas, calcio y fósforo. Se ha encontrado alguna relación de ingesta baja de vitamina D con alguna malformación o anormalidad en la maduración del esmalte de los dientes, por lo que se recomienda tener consciencia de ello durante el embarazo y las edades tempranas del bebé.
                    <br>
        <br>
            Está demostrado que las preferencias alimenticias del bebé están influenciadas por el tipo de alimentación de la madre durante el embarazo y la lactancia por lo que sugerimos evitar aquellos alimentos ricos en azúcares añadidos.
            </p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">Lactancia materna.</span>
            <p>Otra función del odontopediatra es promover la lactancia materna como método de alimentación exclusivo durante los primeros 6 meses de vida, ya que contiene todos los nutrientes que requiere el recién nacido para su desarrollo y crecimiento, además de contener inmunoglobulinas que protegen al bebé de alergias e infecciones. Algo que queremos que recuerdes es que la lactancia materna influye también en que el niño desarrolle una correcta deglución que es muy importante para estimular el desarrollo de las arcadas donde estarán erupcionando los dientes de tu pequeño.
                    <br>
        <br>
            <span style="font-weight: bold; font-style: italic;">Una correcta función tanto en la respiración y la deglución, te evitará futuros tratamientos de ortodoncia.</span>
            </p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">Alimentación complementaria.</span>
            <p>Se recomienda iniciar una alimentación complementaria alrededor de los 6 meses de edad que coincide justamente con el periodo de erupción de los primeros dientes. Esta es la razón por la que sugerimos evitar alimentos con azúcares añadidos hasta los dos años mínimo. Los dientes al hacer erupción en la boca no están del todo maduros por lo que una mala higiene o una dieta rica en azúcar puede rápidamente dañarlos. 
        <br>
        <br>
            Es importante que durante este periodo visites al odontopediatra, para tener un control de la higiene y evitemos juntos con los cuidados necesarios, caries en sus primeros dientitos.
            </p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">Hábitos parafuncionales.</span>
            <p>Son todas aquellas practicas adquiridas que se repiten frecuentemente, de manera inconsciente y no tienen alguna función especifica. 
        <br>
        <br>
            Los más comunes son succion digital, respiración oral, deglución atípica y masticación de objetos. También podemos considerar onicofagia( muerde uñas) y succión labial.
        <br>
        <br>
            Todos ellos repercuten en el crecimiento de las estructuras orales, en la función correcta de la boca y si persiste se convierte en un factor de riesgo para que tu bebé tenga algún problema con el acomodo de los dientes o la mordida.
            </p>
            <span style="color: #f36e8b; font-weight: bold; font-size: 1.4rem;">Visita al odontopediatra.</span>
            <p>Una de las mejores maneras de prevenir cualquier enfermedad o mala posición dental futura siempre será, hacer una visita al odontopediatra de ser posible desde el embarazo.
        <br>
        <br>
            Si no te fue posible visitarnos antes del nacimiento del bebé, recuerda que cualquier anormalidad en la lactancia puede indicarte problemas en los tejidos de la boca del pequeño, también es posible que tu bebé nazca con dientes y eso es un motivo de consulta.
        <br>
        <br>
            Algunos dentistas recomiendan la primer consulta dental cuando aparezca el primer diente en la boca del bebé. 
            </p>
                    <div style="text-align: center; margin-top:-4rem;">
            <span style="color: #eb3e95; font-size: 1.4rem; font-style: italic;">
                Siempre es un buen momento para ser la primera vez, todos los niños merecen sonreír. 
            </span>
            </div>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/manotas1.png", // Imagen del blog
        category: "Odontopediatría",

        categoryColor: "#e70885", // Color del fondo de la categoría
        author: {
            name: "Patricia Peña Raigosa",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/PatriciaPena1.jpg", // Imagen del autor
        },
        date: "12-03-2025",
    },
    {
        id: 16,
        title: "💧¿Cuánta agua necesitan los niños?",
        // title1: "(Las caries no se heredan, se heredan hábitos de alimentación y de higiene)",
        description:
            `Hablamos sobre la importancia de mantener una adecuada hidratación en los niños y cómo influye en su salud y desarrollo. Destacamos la cantidad recomendada de agua según la edad, la manera de fomentar el consumo de agua y la importancia de evitar bebidas azucaradas. Como odontopediatra, mi compromiso es guiar a las familias para establecer hábitos de hidratación saludables desde la infancia.`,
        text: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>La hidratación es clave para el crecimiento y desarrollo de los niños. Sin embargo, es común que no consuman suficiente agua o que, por el contrario, prefieran bebidas azucaradas en lugar de agua natural. Entonces, ¿cuánta agua necesitan realmente los niños según su edad? ¿Qué señales nos indican que están deshidratados? ¡Aquí te lo explico todo!</p>
    <span style="color: #00bcf2; font-weight: bold; font-size: 1.4rem;">¿Por qué es importante que los niños estén bien hidratados?</span>
    <p>El agua es el componente principal del cuerpo humano, representando entre el 50% y el 60% del peso corporal en los niños. El agua es esencial para:</p>
    <ul style="list-style-type: none;">
        <li>✅ Regular la temperatura corporal</li>
        <li>✅ Transportar nutrientes y oxígeno a las células</li>
        <li>✅ Eliminar toxinas y desechos a través de la orina y el sudor</li>
        <li>✅ Mantener el buen funcionamiento del sistema digestivo</li>
        <li>✅ Lubricar las articulaciones</li>
        <li>✅ Concentración y rendimiento cognitivo</li>
    </ul>
    <p>Cuando los niños no están bien hidratados, pueden presentar cansancio, dolor de cabeza, dificultad para concentrarse e incluso cambios de humor.</p>
    <span style="color: #00bcf2; font-weight: bold; font-size: 1.4rem;">¿Cuánta agua necesitan los niños según su edad? 💧</span>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead>
            <tr style="background-color: #00bcf2; color: #fff;">
                <th style="padding: 10px; border: 1px solid #ccc;">Edad</th>
                <th style="padding: 10px; border: 1px solid #ccc;">Cantidad de agua recomendada (al día)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">1 a 3 años</td>
                <td style="padding: 10px; border: 1px solid #ccc;">4 a 6 vasos (aprox. 1.3 litros)</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">4 a 8 años</td>
                <td style="padding: 10px; border: 1px solid #ccc;">5 a 7 vasos (aprox. 1.7 litros)</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">9 a 13 años</td>
                <td style="padding: 10px; border: 1px solid #ccc;">7 a 10 vasos (aprox. 2.1 a 2.4 litros)</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">14 a 18 años</td>
                <td style="padding: 10px; border: 1px solid #ccc;">8 a 11 vasos (aprox. 2.3 a 2.7 litros)</td>
            </tr>
        </tbody>
    </table>
    <p><strong>Importante:</strong> Si el niño realiza actividad física intensa o está en un clima muy caluroso, estas cantidades pueden aumentar para compensar la pérdida de líquidos por el sudor.</p>
    <span style="color: #00bcf2; font-weight: bold; font-size: 1.4rem;">¿Agua, leche o jugos? ¿Qué es mejor?🤔</span>
    <p>No todas las bebidas hidratan igual. Aquí te explico las mejores y las que es mejor evitar:</p>
    <ul>
        <li style="list-style-type: none;">✅ <strong>Lo mejor para hidratar:</strong></li>
        <ul style="list-style-type: none;">
            <li>💧 Agua natural: Siempre será la mejor opción.</li>
            <li>🥛 Leche (entera o baja en grasa): Aporta proteínas, calcio y otros nutrientes esenciales.</li>
            <li>🥥 Agua de coco: Ideal para reponer electrolitos después de actividad física, pero en cantidades moderadas pues contiene azúcares.</li>
        </ul>
        <li style="list-style-type: none;">🚫 <strong>Bebidas que es mejor evitar o limitar:</strong></li>
        <ul style="list-style-type: none;">
            <li>Jugos de frutas: Aunque parezcan saludables, contienen mucha azúcar y pocas fibras. Mejor consumir una fruta entera.</li>
            <li>Bebidas energéticas o deportivas: Contienen demasiada azúcar y cafeína, además generalmente no son adecuadas para niños.</li>
            <li>Refrescos y aguas saborizadas: Altos en azúcar y aditivos que deshidratan en lugar de hidratar.</li>
        </ul>
    </ul>
    <span style="color: #00bcf2; font-weight: bold; font-size: 1.4rem;">🚦 Señales de deshidratación en los niños</span>
    Es importante estar atentos a las señales que indican que tu hijo podría estar deshidratado:
    <ul style="list-style-type: none;">
        <li>🔴 Boca y labios secos</li>
        <li>🔴 Orina oscura o muy poca cantidad</li>
        <li>🔴 Fatiga o irritabilidad</li>
        <li>🔴 Dolor de cabeza</li>
        <li>🔴 Piel fría o seca</li>
        <li>🔴 Mareos o confusión</li>
    </ul>
    <p>Si notas estos síntomas, ofrécele agua inmediatamente y evita el consumo de bebidas azucaradas, ya que pueden empeorar el problema.</p>
    <span style="color: #00bcf2; font-weight: bold; font-size: 1.4rem;">💡 Consejos para que los niños tomen más agua</span>
    <ul style="list-style-type: none;">
        <li>✅ Dale un vaso de agua al despertar y antes de cada comida.</li>
        <li>✅ Ponle un vaso o botella de agua cerca durante el día.</li>
        <li>✅ Usa popotes divertidos o vasos coloridos para que les llame la atención.</li>
        <li>✅ Añade rodajas de frutas (limón, naranja, pepino) para dar sabor sin azúcar.</li>
        <li>✅ Sé su ejemplo: Si te ven tomando agua, ellos lo imitarán.</li>
        <li>✅ Incluye alimentos ricos en agua: Pepino, sandía, melón, naranja, fresas y apio también son fuente de agua.</li>
    </ul>
    <div style="text-align: center;">
        <span style="color: #00bcf2; font-size: 1.4rem; font-style: italic;">
            🌟 La hidratación es clave para que los niños tengan energía, concentración y un buen estado de ánimo.🌟
        </span>
    </div>

    <p style="text-align: center; margin-top: -1rem; font-size: 1rem; color: #999;">- Nutrióloga Andrea Soria</p>
</div>
            `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/agua1.png", // Imagen del blog
        category: "Nutrición",

        categoryColor: "#7abb4b", // Color del fondo de la categoría
        author: {
            name: "Silvia Andrea Soria Díaz",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/AndreaSoria1.jpg", // Imagen del autor
        },
        date: "18-03-2025",
    }, {
        id: 17,
        title: "¿Qué hacer si descubro que mi hijo consume contenido para adultos?⚠️",
        description:
            `
            En este blog hablamos sobre cómo abordar la difícil situación de descubrir que tu hijo ha estado expuesto a contenido para adultos. Destacamos la importancia de mantener la calma, comprender las razones detrás de esta situación y guiar a los niños desde una educación sexual sana y abierta. Como padres, nuestro objetivo debe ser crear un ambiente de confianza donde nuestros hijos se sientan seguros para compartir sus dudas y preocupaciones.
    `,
        text: `
<p>Uno de los motivos de consulta más recurrentes en la crianza actual es la preocupación de los padres al descubrir que su hijo ha estado expuesto a contenido para adultos. Esta situación puede generar sorpresa, miedo e incluso enojo, pero es importante abordarla desde la calma y la crianza sana. Más que castigar o reprimir, el objetivo debe ser comprender la situación, brindar una educación sexual acorde a su desarrollo y fortalecer la confianza para que nuestros hijos puedan acudir a nosotros con sus dudas.</p>
<span style="color: #1a9fad; font-weight: bold; font-size: 1.4rem;">¿Por dónde empezar?</span>
<p>Primordialmente, <span style="color: #1a9fad;font-weight: bold;">debes guardar la calma</span>, sé que puede ser complicado por la gravedad del asunto, pero si llegas con las emociones a flor de piel, puedes hacer o decir cosas de las cuales después puedes arrepentirte.</p>
<p>Quiero decirte que cuando un menor busca o consume este tipo de contenido, es porque su curiosidad en el tema sexual fue despertada, sin embargo, al no hacerlo con quien cuida de él, pudo ser resultado del miedo o de la pena. Es por ello que buscó en otro lado sus respuestas…</p>
Ahora bien, si te encuentras en esta situación, antes de reaccionar, es clave analizar tres aspectos:
<ul style="list-style: none; padding-left: 0;">
    <li><strong><span style="color: #1a9fad;font-weight: bold;">Frecuencia:</span></strong> ¿Fue un hecho aislado o ha ocurrido en repetidas ocasiones? Un solo incidente puede ser resultado de curiosidad natural o exposición accidental, mientras que una búsqueda recurrente puede indicar una necesidad de información que no ha sido cubierta.</li>
    <li><strong><span style="color: #1a9fad;font-weight: bold;">Calidad del contenido:</span></strong> No todo el material explícito tiene el mismo impacto. Es importante diferenciar si el niño o adolescente accedió a imágenes, videos o contenido con temáticas violentas o distorsionadas sobre la sexualidad. Esto nos ayudará a identificar qué tipo de conversación debemos tener y qué aspectos es necesario aclarar.</li>
    <li><strong><span style="color: #1a9fad;font-weight: bold;">Duración de la exposición:</span></strong> Observar este tipo de contenido por unos segundos debido a un anuncio emergente o una imagen en redes sociales es muy distinto a buscarlo intencionadamente durante largos periodos. La duración nos puede dar pistas sobre si fue una exposición accidental, curiosidad puntual o un hábito establecido.</li>
</ul>
<span style="color: #1a9fad; font-weight: bold; font-size: 1.4rem;">Educación sexual sin tabúes</span>
<p>Uno de los errores más comunes al abordar este tema es reaccionar desde la censura y el juicio, lo que puede generar culpa y secretismo en los niños y adolescentes. La sexualidad es un aspecto natural del desarrollo humano, y hablar de ella de manera abierta, con información adecuada a su edad, les permitirá comprender mejor su cuerpo, los límites personales y la importancia del respeto en las relaciones.</p>
<p>Si descubres que tu hijo ha consumido contenido para adultos, aprovecha la oportunidad para conversar. Pregunta con interés genuino, sin enojo ni vergüenza. Explícale que este tipo de material no refleja la realidad de las relaciones sanas y afectivas, y bríndale herramientas para entender su propio desarrollo desde la educación y la confianza.</p>
<span style="color: #1a9fad; font-weight: bold; font-size: 1.4rem;">Finalmente…</span>
<p>Recuerda que la crianza basada en la disciplina positiva no se enfoca en castigar, sino en guiar. Al crear un ambiente seguro y abierto al diálogo, estarás ayudando a tu hijo a desarrollar una relación saludable con su sexualidad, basada en el respeto, la información y el acompañamiento adecuado. Si no te sientes capaz para hacerlo en el momento que lo descubres, es completamente entendible. Acercarse a un sexólogo o psicólogo infanto-juvenil puede ser beneficioso tanto para el menor como para quien cuida de él y seguir descubriendo <span style="color: #1a9fad;font-weight: bold;">el arte de sanar, jugando.</span></p>


        `,

        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/contenidoadultos.jpeg", // Imagen del blog
        category: "Psicología",

        categoryColor: "#1a9fad", // Color del fondo de la categoría
        author: {
            name: "Psic. Luis A. Galván",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/Luis1.jpg", // Imagen del autor
        },
        date: "20-01-2025",
    },
    {
        id: 15,
        title: "La hora del cuento",
        description:
            `¿Cómo estimula el lenguaje de mi peque? En este blog descubrirás cómo los libros no solo enriquecen el vocabulario de los niños, sino que fortalecen sus habilidades cognitivas, emocionales y sociales. ¡Acompáñame en este viaje lector!`,
        text: `
            <p><span style="color: #b475ec; font-weight: bold;">Hola hola</span> a todos papis y mamis, es un gusto saludarlos de nuevo. En esta ocasión quiero compartir con ustedes este tema fascinante sobre el <span style="color: #b475ec; font-weight: bold;">mundo de los libros</span> y su relación con las habilidades lingüísticas de los peques.</p>
            <p>Como les he mencionado en los blogs pasados, el desarrollo del <span style="color: #b475ec; font-weight: bold;">lenguaje</span> en los niños está influenciado en gran parte por el <span style="color: #b475ec; font-weight: bold;">ambiente</span> en el que se encuentran... así que entre más estimulante sea el <span style="color: #b475ec; font-weight: bold;">entorno</span> mayor será su <span style="color: #1a9fad; font-weight: bold;">comprensión </span>del lenguaje y el uso del <span style="color: #b475ec; font-weight: bold;">habla</span>.</p>
    
            <div style="text-align: center; font-weight: bold; margin-top: 1rem;">Los libros son excelentes para ello... A continuación te comparto algunos de los <span style="color: #b475ec; font-weight: bold;">beneficios de leer y cómo hacerlo interesante</span>:</div>
    
            <ol>
                <li><strong>Aumento del vocabulario:</strong> La lectura expone a los niños a nuevas palabras y frases que no necesariamente usarían en conversaciones cotidianas. 
                <br><em style="color:#b475ec; font-weight: bold;">¿Cómo lo hago?</em> Detente en palabras nuevas y explícalas. Por ejemplo: "el ocaso" → "cuando se pone el sol". Luego, reutilízalas en otro momento.</li>
    
                <li><strong>Mejora de la comprensión lectora:</strong> Leer historias desarrolla la inferencia, predicción y deducción.
                <br><em style="color:#b475ec; font-weight: bold;">¿Cómo lo estimulo?</em> Haz preguntas: “¿Tú qué hubieras hecho?”, “¿Qué crees que pase ahora?”, o “¿Dónde vivía el personaje?”.</li>
    
                <li><strong>Estimulación de la creatividad e imaginación:</strong> Los libros fomentan que los niños creen imágenes mentales, lo cual no ocurre al ver una película.</li>
    
                <li><strong>Fomento de la expresión oral:</strong> Leer en voz alta mejora la entonación, ritmo y pronunciación.
                <br><em style="color:#b475ec; font-weight: bold;">¿Cómo lo practico?</em> Usa diferentes tonos de voz, susurra, cambia el ritmo para crear tensión.</li>
    
                <li><strong>Desarrollo de habilidades de escucha:</strong> Escuchar leer desarrolla la atención auditiva y la comprensión de estilos de lenguaje.</li>
    
                <li><strong>Exposición a la alfabetización temprana:</strong> Los libros familiarizan a los niños con letras, sonidos y palabras desde edad temprana.</li>
    
                <li><strong>Refuerzo de gramática y estructura del lenguaje:</strong> La lectura muestra cómo se estructuran frases y tiempos verbales.
                <br><em style="color:#b475ec; font-weight: bold;">Sin memorización forzada.</em></li>
    
                <li><strong>Desarrollo emocional y social:</strong> Al identificarse con los personajes, los niños desarrollan empatía y habilidades sociales.</li>
    
                <li><strong>Fortalecimiento del vínculo padre-hijo:</strong> Leer juntos es un momento de calidad que refuerza la conexión afectiva.</li>
    
                <li><strong>Habilidades cognitivas generales:</strong> Mejora la memoria, atención y concentración, necesarias para el aprendizaje.</li>
            </ol>
    
            <p><strong>📌 Consejo final:</strong> Asegúrate de que el libro sea adecuado para la edad de tu peque, con imágenes y texto llamativos.</p>
    
            <p>Me dio mucho gusto compartir este blog sobre los <span style="color: #1a9fad; font-weight: bold;">libros y el lenguaje</span>. Como terapeuta de la comunicación humana, es una herramienta esencial que siempre recomiendo a los papis y mamis de los peques que atiendo. 💜✨️</p>
    
            <div style="text-align: center; margin-top: 2rem;">
                <strong>No dudes en contactarme para:</strong>
                <br><span style="color: #b475ec; font-weight: bold;">Asesorías personalizadas • Planes de actividades en casa • Atención presencial en mi consulta</span>
                <br><br>
                🗨️ 👋 👄 <br>
                🚨 WhatsApp: <strong>+52 618 301 6941</strong>📲
            </div>
        `,
        image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BiancaBlog2.jpeg",
        category: "Terapia de lenguaje",
        categoryColor: "#b475ec",
        author: {
            name: "Bianca Macías",
            image: "https://csdkids-images.s3.us-east-2.amazonaws.com/BiancaMacias1.jpg",
        },
        date: "27-03-2025"
    }

];

export default blogs;
