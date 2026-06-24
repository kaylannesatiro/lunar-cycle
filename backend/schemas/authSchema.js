const {z, regex} = require('zod');

const criarContaSchema = z.object({
    nome: z.string({required_error: 'O nome é obrigatório.'}).
    min(3, 'O nome deve ter pelo menos 3 caracteres.').
    max(60, 'O nome deve ter no máximo 60 caracteres.').
    regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'O nome deve conter apenas letras e espaços.'),

    email: z.string({required_error: 'O email é obrigatório.'}).
    email('Formato de email inválido.'),

    senha: z.string({required_error: 'A senha é obrigatória.'}).
    min(8, 'A senha deve ter pelo menos 8 caracteres.').
    regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),

    signo: z.string({required_error: 'O signo é obrigatório.'}).
    regex(/^(Áries|Touro|Gêmeos|Câncer|Leão|Virgem|Libra|Escorpião|Sagitário|Capricórnio|Aquário|Peixes)$/, 'Signo inválido. Os signos válidos são: Áries, Touro, Gêmeos, Câncer, Leão, Virgem, Libra, Escorpião, Sagitário, Capricórnio, Aquário e Peixes.'),

    duracaoCiclo: z.number({required_error: 'A duração do ciclo é obrigatória.'}).
    int('A duração do ciclo deve ser um número inteiro.').
    min(1, 'A duração do ciclo deve ser no mínimo 1 dia.'),
    
    duracaoMenstruacao: z.number({required_error: 'A duração da menstruação é obrigatória.'}).
    int('A duração da menstruação deve ser um número inteiro.').
    min(1, 'A duração da menstruação deve ser no mínimo 1 dia.'),
})

.refine((data) => {
    return data.duracaoMenstruacao < data.duracaoCiclo;
}, {
    message: 'A duração da menstruação deve ser menor que a duração do ciclo.',
    path: ['duracaoMenstruacao'],
});


const loginSchema = z.object({
    email: z.string({required_error: 'Informe seu email.'}).
    min(1, 'O email é obrigatório.').
    transform((val) => val.toLowerCase()),

    senha: z.string({required_error: 'Informe sua senha.'}).
    min(1, 'A senha é obrigatória.')
});

module.exports = {
    criarContaSchema,
    loginSchema
}