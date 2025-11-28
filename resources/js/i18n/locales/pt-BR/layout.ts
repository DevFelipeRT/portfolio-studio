import type { TranslationTree } from '../../core/types';

const layout: TranslationTree = {
    header: {
        landmarkLabel: 'Cabeçalho da aplicação',
        brand: {
            title: 'Felipe Ruiz Terrazas',
            tagline: 'Desenvolvedor full-stack',
            homeLabel: 'Ir para a página inicial',
        },
        navigation: {
            home: 'Início',
            experience: 'Experiência',
            projects: 'Projetos',
            education: 'Formação',
            contact: 'Contato',
            primaryLabel: 'Navegação principal',
            mobileTitle: 'Navegação',
            dashboard: 'Painel',
            inbox: 'Caixa de entrada',
            portfolio: 'Portfólio',
            portfolioProjects: 'Projetos',
            portfolioExperiences: 'Experiências',
            portfolioCourses: 'Cursos',
            portfolioTechnologies: 'Tecnologias',
            portfolioInitiatives: 'Iniciativas',
            highlights: 'Destaques',
            stack: 'Stack',
            initiatives: 'Iniciativas',
        },
    },

    userMenu: {
        openLabel: 'Abrir menu do usuário',
        dashboard: 'Dashboard',
        profile: 'Perfil',
        settings: 'Configurações',
        logout: 'Sair',
    },

    footer: {
        madeBy: 'Desenvolvido por Felipe Ruiz Terrazas.',
        rights: 'Todos os direitos reservados.',
        links: {
            github: 'GitHub',
            linkedin: 'LinkedIn',
            email: 'E-mail',
        },
    },
};

export default layout;
