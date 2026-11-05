const empresa = {
    nome: "Boatur",

    segmento: "Agência de viagens",

    descricao: `
        A Boatur é uma agência de viagens responsável pelo
        atendimento e relacionamento com seus clientes.

        A empresa trabalha com destinos e pacotes de viagem
        de acordo com as necessidades e interesses de cada cliente.
    `,

    // ✏️ MUDE AQUI: o trecho "estão detalhados na aba de Destinos" (linha abaixo) é o que faz o
    // botão "Ver destinos" aparecer. Se mudar o nome da aba, ajuste também acaoDestinos em server/app.js.
    informacoes: `
- A agência de viagens BoaTour disponibiliza um catálogo composto por 17 destinos turísticos, sendo eles: Fernando de Noronha, no Brasil; Santorini, na Grécia; Cancún, no México; Bali, na Indonésia; Maldivas; Paris, na França; Roma, na Itália; Disney Orlando, nos Estados Unidos; Gramado, no Brasil; Foz do Iguaçu, no Brasil; Curitiba, no Brasil; Salvador, no Brasil; Rio de Janeiro, no Brasil; Maceió, no Brasil; Porto Seguro, no Brasil; Buenos Aires, na Argentina; e Lisboa, em Portugal.
- Entre os destinos oferecidos, destacam-se por serem mais visitados Paris, Cancún, Orlando, Roma, Bali e Rio de Janeiro, que possuem expressivo reconhecimento e relevância no cenário turístico pela agência. Outros destinos, como Santorini, Maldivas, Lisboa e Buenos Aires, também apresentam grande atratividade turística, sendo reconhecidos por suas paisagens, patrimônio histórico, cultura e opções de lazer. O catálogo contempla diferentes experiências de viagem, atendendo a variadas preferências e interesses turísticos.
- Caso dúvidas em relação a preço ou outras informações em relação á destinos, explicar que estão detalhados na aba de Destinos.
- A BoaTour disponibiliza passagens aéreas para os destinos presentes em seu catálogo turístico, contemplando rotas nacionais e internacionais. Entre as opções oferecidas, encontram-se passagens com destino a Fernando de Noronha, Gramado, Foz do Iguaçu, Salvador, Rio de Janeiro, Maceió, Porto Seguro, Paris, Roma, Lisboa, Buenos Aires, Cancún, Orlando, Bali e Santorini, entre outros destinos disponíveis pela agência.
`
};

// ✏️ MUDE AQUI o contato. Fica FORA do objeto "empresa" de propósito: o modelo não enxerga esse número,
// então não tem como soltá-lo sem ser pedido. Quem responde é o server/app.js quando o cliente pede contato.
export const contatoEmpresa = {
    celular: "+55 (48) 99201-9988"
};

export default empresa;