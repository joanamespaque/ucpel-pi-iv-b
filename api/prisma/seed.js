/**
 * Carga inicial do banco de dados.
 *
 * A estrutura (CTs, espaços, cargos e times) reproduz a organização pública
 * do Sport Club Internacional. Os nomes de pessoas são ilustrativos e não
 * correspondem a atletas ou profissionais reais.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Elenco base: [nome, nome de camisa, número, posição, pé, nascimento]. */
const MEN_PLAYERS = [
  ['Rafael Moreira Lima', 'Rafael M.', 1, 'GOLEIRO', 'DIREITO', '1994-03-12'],
  ['Thiago Azevedo Prates', 'Thiago', 12, 'GOLEIRO', 'DIREITO', '1999-07-25'],
  ['Caio Bertolini', 'Bertolini', 22, 'GOLEIRO', 'ESQUERDO', '2004-01-30'],
  ['Henrique Salvador Costa', 'Henrique', 4, 'ZAGUEIRO', 'DIREITO', '1996-11-02'],
  ['Matheus Dornelles', 'Dornelles', 3, 'ZAGUEIRO', 'ESQUERDO', '1998-05-17'],
  ['Lucas Fagundes Ribeiro', 'Fagundes', 25, 'ZAGUEIRO', 'DIREITO', '2002-09-08'],
  ['Eduardo Pacheco Neto', 'Pacheco', 44, 'ZAGUEIRO', 'DIREITO', '2000-02-21'],
  ['Gustavo Lemos Andrade', 'Lemos', 2, 'LATERAL', 'DIREITO', '1997-08-14'],
  ['Vinicius Cardoso Tavares', 'Vini Cardoso', 6, 'LATERAL', 'ESQUERDO', '1999-12-03'],
  ['Pedro Henrique Saraiva', 'PH Saraiva', 13, 'LATERAL', 'DIREITO', '2003-04-27'],
  ['Arthur Bittencourt', 'Bittencourt', 16, 'LATERAL', 'ESQUERDO', '2005-06-19'],
  ['Felipe Ourique Mendes', 'Ourique', 5, 'VOLANTE', 'DIREITO', '1995-10-11'],
  ['Diego Rossato', 'Rossato', 8, 'VOLANTE', 'DIREITO', '1998-01-05'],
  ['Bruno Kessler Alves', 'Kessler', 15, 'VOLANTE', 'AMBIDESTRO', '2001-03-29'],
  ['Igor Marchetti', 'Marchetti', 35, 'VOLANTE', 'DIREITO', '2004-07-07'],
  ['Leonardo Vargas Pinto', 'Leo Vargas', 10, 'MEIA', 'ESQUERDO', '1996-09-23'],
  ['Samuel Teixeira Rocha', 'Samuel', 20, 'MEIA', 'DIREITO', '1999-05-01'],
  ['Murilo Fontoura', 'Fontoura', 17, 'MEIA', 'DIREITO', '2002-11-15'],
  ['Otávio Brandão Silveira', 'Otávio', 18, 'MEIA', 'ESQUERDO', '2000-08-09'],
  ['Nicolas Ferraz', 'Ferraz', 28, 'MEIA', 'DIREITO', '2005-02-13'],
  ['André Quevedo Lopes', 'Quevedo', 9, 'ATACANTE', 'DIREITO', '1995-06-30'],
  ['Gabriel Sartori', 'Sartori', 7, 'ATACANTE', 'ESQUERDO', '1998-12-22'],
  ['João Victor Pereira', 'JV Pereira', 11, 'ATACANTE', 'DIREITO', '2001-10-04'],
  ['Kauã Medeiros', 'Kauã', 19, 'ATACANTE', 'DIREITO', '2006-03-18'],
  ['Rodrigo Albuquerque Nunes', 'Albuquerque', 99, 'ATACANTE', 'AMBIDESTRO', '1997-04-10'],
];

const WOMEN_PLAYERS = [
  ['Camila Ferreira Duarte', 'Camila', 1, 'GOLEIRO', 'DIREITO', '1995-02-08'],
  ['Larissa Bonatto', 'Bonatto', 12, 'GOLEIRO', 'DIREITO', '2000-06-14'],
  ['Yasmin Toledo', 'Yasmin', 23, 'GOLEIRO', 'ESQUERDO', '2005-09-27'],
  ['Fernanda Lacerda Paz', 'Lacerda', 3, 'ZAGUEIRO', 'DIREITO', '1997-04-03'],
  ['Juliana Westphalen', 'Westphalen', 4, 'ZAGUEIRO', 'ESQUERDO', '1999-11-19'],
  ['Bianca Rangel', 'Bianca', 14, 'ZAGUEIRO', 'DIREITO', '2002-01-26'],
  ['Tainá Corrêa Brum', 'Tainá', 30, 'ZAGUEIRO', 'DIREITO', '2004-08-12'],
  ['Natália Giacomini', 'Giacomini', 2, 'LATERAL', 'DIREITO', '1998-03-09'],
  ['Amanda Severo Lins', 'Amanda', 6, 'LATERAL', 'ESQUERDO', '2000-10-31'],
  ['Bruna Kuhn', 'Kuhn', 13, 'LATERAL', 'DIREITO', '2003-05-22'],
  ['Letícia Morais Dutra', 'Letícia', 21, 'LATERAL', 'ESQUERDO', '2006-07-15'],
  ['Gabriela Tonin', 'Tonin', 5, 'VOLANTE', 'DIREITO', '1996-12-01'],
  ['Mariana Esteves Prado', 'Mari Esteves', 8, 'VOLANTE', 'DIREITO', '1999-02-17'],
  ['Isadora Klein', 'Isadora', 15, 'VOLANTE', 'AMBIDESTRO', '2001-09-05'],
  ['Rayssa Damasceno', 'Rayssa', 33, 'VOLANTE', 'DIREITO', '2005-04-24'],
  ['Carolina Vieira Mattos', 'Carol Vieira', 10, 'MEIA', 'ESQUERDO', '1997-07-28'],
  ['Eduarda Pilar', 'Duda Pilar', 20, 'MEIA', 'DIREITO', '2000-01-13'],
  ['Sofia Antunes', 'Sofia', 17, 'MEIA', 'DIREITO', '2003-06-06'],
  ['Vitória Lemke', 'Lemke', 18, 'MEIA', 'ESQUERDO', '2002-12-20'],
  ['Helena Brizola Ramos', 'Helena', 26, 'MEIA', 'DIREITO', '2006-02-02'],
  ['Patrícia Goulart', 'Goulart', 9, 'ATACANTE', 'DIREITO', '1996-05-16'],
  ['Luana Ceretta', 'Luana', 7, 'ATACANTE', 'ESQUERDO', '1998-08-29'],
  ['Beatriz Santana Reis', 'Bia Santana', 11, 'ATACANTE', 'DIREITO', '2001-11-07'],
  ['Kemily Andrade', 'Kemily', 19, 'ATACANTE', 'DIREITO', '2005-10-18'],
  ['Valentina Scherer', 'Scherer', 77, 'ATACANTE', 'AMBIDESTRO', '1999-03-25'],
];

/**
 * Converte a tupla do elenco no formato aceito pelo Prisma.
 * @param {Array} tuple dados do jogador
 * @param {number} teamId time ao qual o jogador pertence
 */
function toPlayer([name, shirtName, number, position, preferredFoot, birthDate], teamId) {
  return { name, shirtName, number, position, preferredFoot, birthDate: new Date(birthDate), teamId };
}

async function main() {
  const reset = process.argv.includes('--reset');
  const existing = await prisma.trainingCenter.count();

  if (existing > 0 && !reset) {
    console.log('Banco já possui dados; carga inicial ignorada. Use --reset para recriar.');
    return;
  }

  if (reset) {
    // Recria os dados do zero e reinicia as sequências de ids.
    await prisma.$executeRawUnsafe(
      'TRUNCATE training_sessions, kits, players, staff_members, coaches, teams, facilities, training_centers RESTART IDENTITY CASCADE',
    );
  }

  const parqueGigante = await prisma.trainingCenter.create({
    data: {
      name: 'CT Parque Gigante',
      city: 'Porto Alegre',
      address: 'Av. Padre Cacique, 891, Praia de Belas, Porto Alegre - RS, 90810-240',
      areaHa: 7,
      openedYear: 2005,
      facilities: {
        create: [
          { name: 'Campo 1', type: 'CAMPO', capacity: 40 },
          { name: 'Campo 2', type: 'CAMPO', capacity: 40 },
          { name: 'Academia', type: 'ACADEMIA', capacity: 30 },
          { name: 'Piscina térmica e hidroterapia', type: 'PISCINA', capacity: 12 },
          { name: 'Departamento médico e fisioterapia', type: 'DEPARTAMENTO_MEDICO', capacity: 15 },
          { name: 'Sala de análise de desempenho', type: 'SALA_ANALISE', capacity: 25 },
          { name: 'Auditório', type: 'AUDITORIO', capacity: 60 },
          { name: 'Refeitório', type: 'REFEITORIO', capacity: 80 },
          { name: 'Alojamento (suítes de concentração)', type: 'ALOJAMENTO', capacity: 30 },
        ],
      },
    },
  });

  const alvorada = await prisma.trainingCenter.create({
    data: {
      name: 'CT Morada dos Quero-Queros',
      city: 'Alvorada',
      address: 'Alvorada - RS',
      openedYear: 2012,
      facilities: {
        create: [
          { name: 'Campo A', type: 'CAMPO', capacity: 40 },
          { name: 'Campo B', type: 'CAMPO', capacity: 40 },
          { name: 'Academia', type: 'ACADEMIA', capacity: 25 },
          { name: 'Departamento médico', type: 'DEPARTAMENTO_MEDICO', capacity: 10 },
          { name: 'Sala de análise de desempenho', type: 'SALA_ANALISE', capacity: 20 },
          { name: 'Refeitório', type: 'REFEITORIO', capacity: 60 },
        ],
      },
    },
  });

  const men = await prisma.team.create({
    data: {
      name: 'Internacional (masculino)',
      category: 'MASCULINO',
      nickname: 'Colorado',
      competitions: ['Campeonato Brasileiro Série A', 'Campeonato Gaúcho', 'Copa do Brasil'],
      trainingCenterId: parqueGigante.id,
    },
  });

  const women = await prisma.team.create({
    data: {
      name: 'Internacional (feminino)',
      category: 'FEMININO',
      nickname: 'Gurias Coloradas',
      competitions: ['Campeonato Brasileiro Feminino A1', 'Campeonato Gaúcho Feminino'],
      trainingCenterId: alvorada.id,
    },
  });

  await prisma.coach.create({
    data: {
      name: 'Marcelo Antunes Guedes',
      nationality: 'Brasil',
      license: 'CBF Licença PRO',
      contractStart: new Date('2026-03-10'),
      teamId: men.id,
      staff: {
        create: [
          { name: 'Fábio Rech', role: 'AUXILIAR_TECNICO' },
          { name: 'Renato Cassol', role: 'AUXILIAR_TECNICO' },
          { name: 'Sérgio Lummertz', role: 'PREPARADOR_FISICO' },
          { name: 'Valter Brum', role: 'PREPARADOR_GOLEIROS' },
          { name: 'Daniel Furtado', role: 'ANALISTA_DESEMPENHO' },
          { name: 'Cristiano Heck', role: 'FISIOLOGISTA' },
          { name: 'Dr. Paulo Zanella', role: 'MEDICO' },
          { name: 'Mauro Kaefer', role: 'FISIOTERAPEUTA' },
          { name: 'Aline Becker', role: 'NUTRICIONISTA' },
          { name: 'Tatiana Sperb', role: 'PSICOLOGO' },
          { name: 'Jorge Silveira', role: 'ROUPEIRO' },
        ],
      },
    },
  });

  await prisma.coach.create({
    data: {
      name: 'Luciana Prates Holz',
      nationality: 'Brasil',
      license: 'CBF Licença A',
      contractStart: new Date('2025-12-01'),
      teamId: women.id,
      staff: {
        create: [
          { name: 'Priscila Bolzan', role: 'AUXILIAR_TECNICO' },
          { name: 'Ricardo Wagner', role: 'PREPARADOR_FISICO' },
          { name: 'Elton Brizola', role: 'PREPARADOR_GOLEIROS' },
          { name: 'Marina Fett', role: 'ANALISTA_DESEMPENHO' },
          { name: 'Dra. Simone Ruschel', role: 'MEDICO' },
          { name: 'Carla Hoffmann', role: 'FISIOTERAPEUTA' },
          { name: 'Débora Ritter', role: 'NUTRICIONISTA' },
          { name: 'Vanessa Kirst', role: 'PSICOLOGO' },
          { name: 'Rosane Pires', role: 'ROUPEIRO' },
        ],
      },
    },
  });

  await prisma.player.createMany({
    data: [...MEN_PLAYERS.map((p) => toPlayer(p, men.id)), ...WOMEN_PLAYERS.map((p) => toPlayer(p, women.id))],
  });

  // Situações variadas para demonstrar os filtros da API.
  await prisma.player.updateMany({ where: { teamId: men.id, number: 3 }, data: { status: 'EM_TRATAMENTO' } });
  await prisma.player.updateMany({ where: { teamId: men.id, number: 8 }, data: { status: 'SUSPENSO' } });
  await prisma.player.updateMany({ where: { teamId: women.id, number: 14 }, data: { status: 'EM_TRATAMENTO' } });
}

main()
  .then(() => console.log('Seed finalizado.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
