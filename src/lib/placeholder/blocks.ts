import {ParagraphState} from "../states/ParagraphState.svelte";
import {WordFormat, WordState} from "../states/WordState.svelte";
import {TitleState} from "../states/TitleState.svelte";
import type {State} from "../states/base/State";

export const BLOCKS_PLACEHOLDER: State[] = [
    new TitleState(1, "O que são Isomorfismos?"),
    new TitleState(1, "Aprenda agora?"),
    new ParagraphState([
        new WordState(WordFormat.Normal, "Em matemática e ciência da computação, um "),
        new WordState(WordFormat.Bold, "isomorfismo"),
        new WordState(WordFormat.Normal, " (ensinado por "),
        new WordState(WordFormat.Bold, "Leonardo"),
        new WordState(WordFormat.Normal, "), é um mapeamento estrutural entre dois conjuntos ou estruturas que" +
            " preserva todas" +
            " as propriedades e operações relevantes. Ao identificar quando dois sistemas são isomorfos, podemos traduzir problemas complexos em um domínio para problemas mais simples em outro, resolvê-los de maneira mais eficiente e, em seguida, mapear a solução de volta. Este conceito é fundamental em álgebra, teoria dos grafos e programação."),
    ]),

    new TitleState(1, "Por que os Isomorfismos são Importantes?"),
    new ParagraphState([
        new WordState(WordFormat.Normal, "A utilidade dos isomorfismos reside na sua capacidade de simplificar problemas. Quando identificamos que dois sistemas complexos são isomorfos, podemos converter um problema em outro mais fácil de resolver. Esse conceito é amplamente utilizado em álgebra para transformar equações complexas em formas mais manejáveis e em ciência da computação para otimizar algoritmos."),
    ]),

    new TitleState(1, "Aplicações Práticas de Isomorfismos"),
    new ParagraphState([
        new WordState(WordFormat.Normal, "Os isomorfismos têm aplicações práticas em diversas áreas. Na teoria dos grafos, ajudam a identificar padrões estruturais em redes sociais ou sistemas de transporte. Em programação, permitem mapear uma lógica complexa para uma representação mais simples. Em álgebra, são usados para resolver equações que, de outra forma, seriam intratáveis."),
    ]),

    new ParagraphState([
        new WordState(WordFormat.Normal, "Os isomorfismos também são "),
        new WordState(WordFormat.Bold, "essenciais"),
        new WordState(WordFormat.Normal, " em áreas como criptografia, onde a segurança de sistemas muitas vezes depende da capacidade de mapear estruturas matemáticas de maneira eficiente e segura."),
    ]),

    new ParagraphState([
        new WordState(WordFormat.Normal, "Os isomorfismos têm aplicações práticas em diversas áreas. Na teoria dos grafos, ajudam a identificar padrões estruturais em redes sociais ou sistemas de transporte. Em programação, permitem mapear uma lógica complexa para uma representação mais simples. Em álgebra, são usados para resolver equações que, de outra forma, seriam intratáveis."),
    ])
];