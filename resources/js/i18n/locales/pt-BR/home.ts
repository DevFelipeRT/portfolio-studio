// resources/js/i18n/locales/pt-BR/home.ts
import type { TranslationTree } from '../../core/types';

const home: TranslationTree = {
    meta: {
        title: 'Início',
    },
    landmarks: {
        main: 'Conteúdo principal da página inicial do portfólio',
    },
    hero: {
        sectionLabel:
            'Seção de introdução e contato da página inicial do portfólio',
        eyebrow: 'Portfólio',
        title: 'Desenvolvedor de software focado em aplicações web confiáveis.',
        description:
            'Planejo e implemento aplicações web com arquitetura clara, código sustentável e forte foco na experiência de quem desenvolve e de quem usa.',
        primaryCta: 'Entre em contato',
    },
    highlights: {
        sectionLabel: 'Principais pontos fortes e propostas de valor',
        header: {
            eyebrow: 'Destaques',
            title: 'Como eu gosto de abordar projetos de software.',
            description:
                'Estes pontos resumem como costumo pensar em desenho, implementação e colaboração em aplicações reais.',
        },
        items: {
            architecture: {
                title: 'Arquitetura e confiabilidade',
                description:
                    'Ênfase em limites claros, comportamento previsível e soluções que podem evoluir sem perder estabilidade.',
            },
            quality: {
                title: 'Qualidade e manutenção do código',
                description:
                    'Foco em código legível, estrutura modular e práticas que mantêm a base de código compreensível ao longo do tempo.',
            },
            collaboration: {
                title: 'Colaboração e aprendizado',
                description:
                    'Conforto com revisões, feedback e responsabilidade compartilhada, sempre buscando uma comunicação clara no time.',
            },
        },
    },
    techStack: {
        sectionLabel: 'Tecnologias usadas nos meus projetos',
        header: {
            eyebrow: 'Stack de tecnologias',
            title: 'Tecnologias com as quais trabalho no dia a dia.',
            description:
                'Uma seleção de ferramentas e frameworks que utilizo para projetar, desenvolver e operar aplicações web.',
        },
    },
    projects: {
        sectionLabel: 'Projetos em destaque do portfólio',
        header: {
            eyebrow: 'Projetos',
            title: 'Projetos selecionados com foco técnico.',
            description:
                'Estes projetos ilustram como abordo arquitetura, modelagem de domínio e implementação voltada para o usuário.',
        },
    },
    initiatives: {
        sectionLabel: 'Eventos, oficinas e iniciativas de ensino',
        header: {
            eyebrow: 'Iniciativas',
            title: 'Eventos, oficinas e iniciativas de ensino.',
            description:
                'Uma seleção de iniciativas que liderei ou nas quais contribuí, incluindo palestras, workshops, cursos e ações de extensão.',
        },
    },
    experience: {
        sectionLabel: 'Linha do tempo de experiência profissional',
        header: {
            eyebrow: 'Carreira',
            title: 'Experiência profissional',
            description:
                'Uma linha do tempo de funções e responsabilidades que moldaram minha trajetória profissional.',
        },
        emptyMessage: 'Ainda não há experiências profissionais para exibir.',
        presentLabel: 'Atual',
    },
    education: {
        sectionLabel: 'Formação acadêmica e cursos complementares',
        header: {
            eyebrow: 'Formação',
            title: 'Graduação e cursos profissionalizantes',
            description:
                'Formação acadêmica e cursos profissionalizantes complementares que fortalecem meu perfil como desenvolvedor de software.',
        },
        emptyMessage: 'Ainda não há registros de formação para exibir.',
        presentLabel: 'Atual',
        badge: {
            notHighlighted: 'Não está destacado atualmente',
        },
    },
    contact: {
        sectionLabel: 'Contato e colaboração',
        header: {
            eyebrow: 'Contato',
            title: 'Vamos falar sobre oportunidades, projetos e colaboração.',
            description:
                'Se você busca um desenvolvedor para fortalecer sua equipe, apoiar um projeto específico ou iniciar uma colaboração técnica, utilize o formulário ou um dos canais abaixo para entrar em contato.',
        },
        form: {
            name: {
                label: 'Nome',
                placeholder: 'Seu nome',
            },
            email: {
                label: 'E-mail',
                placeholder: 'voce@exemplo.com',
            },
            message: {
                label: 'Mensagem',
                placeholder:
                    'Compartilhe o que você tem em mente e como posso ajudar.',
            },
            submit: {
                default: 'Enviar mensagem',
                processing: 'Enviando…',
            },
        },
        sidebar: {
            heading: 'Outros canais de contato',
            description:
                'Você também pode falar comigo pelo canal de sua preferência, utilizando os links abaixo para acessar meus perfis e conhecer melhor meu trabalho.',
        },
    },
};

export default home;
