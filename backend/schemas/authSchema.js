const {z} = require('zod');
 

// CONSTANTES REUTILIZÁVEIS

 
const SIGNOS_VALIDOS = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];
 
const REGEX_SENHA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 
const REGEX_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
 

// SCHEMAS REUTILIZÁVEIS


const nomeSchema = z.string({required_error: 'O nome é obrigatório.'})
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .max(60, 'O nome deve ter no máximo 60 caracteres.')
    .regex(REGEX_NOME, 'O nome deve conter apenas letras e espaços.');

const emailSchema = z.string({required_error: 'O email é obrigatório.'})
    .email('Formato de email inválido.')
    .transform((val) => val.toLowerCase());

const senhaSchema = z.string({required_error: 'A senha é obrigatória.'})
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(REGEX_SENHA, 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');

const signoSchema = z.enum(SIGNOS_VALIDOS, {
    errorMap: () => ({ 
        message: `Signo inválido. Os signos válidos são: ${SIGNOS_VALIDOS.join(', ')}.` 
    })
});

const cicloSchema = z.number({required_error: 'A duração do ciclo é obrigatória.'})
    .int('A duração do ciclo deve ser um número inteiro.')
    .min(1, 'A duração do ciclo deve ser no mínimo 1 dia.')
    .max(100, 'A duração do ciclo deve ser no máximo 100 dias.');

const menstruacaoSchema = z.number({required_error: 'A duração da menstruação é obrigatória.'})
    .int('A duração da menstruação deve ser um número inteiro.')
    .min(1, 'A duração da menstruação deve ser no mínimo 1 dia.')
    .max(100, 'A duração da menstruação deve ser no máximo 100 dias.');

// SCHEMAS FINAIS

const criarContaSchema = z.object({
    nome: nomeSchema,
    email: emailSchema,
    senha: senhaSchema,
    signo: signoSchema,
    duracaoCiclo: cicloSchema,
    duracaoMenstruacao: menstruacaoSchema,
}).refine(
    (data) => data.duracaoMenstruacao < data.duracaoCiclo,
    {
        message: 'A duração da menstruação deve ser menor que a duração do ciclo.',
        path: ['duracaoMenstruacao'],
    }
);
 
const loginSchema = z.object({
    email: z.string({required_error: 'Informe seu email.'})
        .email('O email é obrigatório.')
        .transform((val) => val.toLowerCase()),
    senha: z.string({required_error: 'Informe sua senha.'})
        .min(1, 'A senha é obrigatória.')
});
 
const atualizarPerfilSchema = z.object({
    nome: nomeSchema,
    email: emailSchema,
    signo: signoSchema,
    duracaoCiclo: cicloSchema,
    duracaoMenstruacao: menstruacaoSchema,
    senhaAtual: senhaSchema.optional(),
    novaSenha: senhaSchema.optional(),
    confirmarNovaSenha: senhaSchema.optional(),
})
.refine(
    (data) => data.duracaoMenstruacao < data.duracaoCiclo,
    {
        message: 'A duração da menstruação deve ser menor que a duração do ciclo.',
        path: ['duracaoMenstruacao'],
    }
)
.refine(
    (dados) => {
        const tentouMudarSenha = dados.senhaAtual || dados.novaSenha || dados.confirmarNovaSenha;
        const preencheuTodos = dados.senhaAtual && dados.novaSenha && dados.confirmarNovaSenha;
        
        // Se tentou mudar mas não preencheu tudo, falha
        return !tentouMudarSenha || preencheuTodos;
    },
    {
        message: 'Para alterar a senha, é necessário preencher a senha atual, a nova senha e a confirmação da nova senha.',
        path: ['novaSenha'],
    }
)
.refine(
    (dados) => {
        // Se preencheu nova senha e confirmação, elas devem ser iguais
        if (dados.novaSenha && dados.confirmarNovaSenha) {
            return dados.novaSenha === dados.confirmarNovaSenha;
        }
        return true;
    },
    {
        message: 'As senhas não coincidem.',
        path: ['confirmarNovaSenha'],
    }
)
.refine(
    (dados) => {
        // Nova senha não pode ser igual à atual
        if (dados.senhaAtual && dados.novaSenha) {
            return dados.senhaAtual !== dados.novaSenha;
        }
        return true;
    },
    {
        message: 'A nova senha não pode ser igual à senha atual.',
        path: ['novaSenha'],
    }
);
 
module.exports = {
    criarContaSchema,
    loginSchema,
    atualizarPerfilSchema,
    // Exporta schemas individuais para reutilização
    nomeSchema,
    emailSchema,
    senhaSchema,
    signoSchema,
    cicloSchema,
    menstruacaoSchema,
};