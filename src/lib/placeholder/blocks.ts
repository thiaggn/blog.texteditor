import {ParagraphState} from "../states/ParagraphState.svelte";
import {WordFormat, WordState} from "../states/WordState.svelte";
import {TitleState} from "../states/TitleState.svelte";
import type {IState} from "../states/base/IState";
import type {IBlockState} from "../states/base/IBlockState";

export const BLOCKS_PLACEHOLDER: IBlockState[] = [
    new TitleState(1, "Por que os Isomorfismos são Importantes?"),
    new TitleState(1, "Faber Castell."),
    new ParagraphState([
        new WordState(WordFormat.Normal, "A utilidade dos "),
        new WordState(WordFormat.Bold, "isomorfismos"),
        new WordState(WordFormat.Normal, " reside na sua capacidade de simplificar problemas. Quando identificamos que dois sistemas complexos são isomorfos, podemos converter um problema em outro mais fácil de resolver. Esse conceito é amplamente utilizado em álgebra para transformar equações complexas em formas mais manejáveis e em ciência da computação para otimizar algoritmos.")
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