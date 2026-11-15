<?php

declare(strict_types=1);

namespace InterCT\Client\Support;

/**
 * Rótulos em português para os valores enumerados da API.
 */
final class Labels
{
    public const POSITIONS = [
        'GOLEIRO' => 'Goleiro(a)',
        'ZAGUEIRO' => 'Zagueiro(a)',
        'LATERAL' => 'Lateral',
        'VOLANTE' => 'Volante',
        'MEIA' => 'Meia',
        'ATACANTE' => 'Atacante',
    ];

    public const STATUSES = [
        'DISPONIVEL' => 'Disponível',
        'EM_TRATAMENTO' => 'Em tratamento',
        'SUSPENSO' => 'Suspenso(a)',
    ];

    public const FEET = [
        'DIREITO' => 'Direito',
        'ESQUERDO' => 'Esquerdo',
        'AMBIDESTRO' => 'Ambidestro',
    ];

    public const CATEGORIES = [
        'MASCULINO' => 'Masculino',
        'FEMININO' => 'Feminino',
    ];

    public const FACILITIES = [
        'CAMPO' => 'Campo',
        'ACADEMIA' => 'Academia',
        'PISCINA' => 'Piscina',
        'AUDITORIO' => 'Auditório',
        'SALA_ANALISE' => 'Sala de análise',
        'DEPARTAMENTO_MEDICO' => 'Departamento médico',
        'REFEITORIO' => 'Refeitório',
        'ALOJAMENTO' => 'Alojamento',
    ];

    public const ROLES = [
        'AUXILIAR_TECNICO' => 'Auxiliar técnico',
        'PREPARADOR_FISICO' => 'Preparador físico',
        'PREPARADOR_GOLEIROS' => 'Preparador de goleiros',
        'ANALISTA_DESEMPENHO' => 'Analista de desempenho',
        'FISIOLOGISTA' => 'Fisiologista',
        'MEDICO' => 'Médico',
        'FISIOTERAPEUTA' => 'Fisioterapeuta',
        'NUTRICIONISTA' => 'Nutricionista',
        'PSICOLOGO' => 'Psicólogo',
        'ROUPEIRO' => 'Roupeiro',
    ];

    public const KITS = [
        'JOGO_1' => 'Jogo 1 (titular)',
        'JOGO_2' => 'Jogo 2 (reserva)',
        'JOGO_3' => 'Jogo 3 (alternativo)',
        'GOLEIRO' => 'Goleiro',
        'TREINO' => 'Treino',
        'VIAGEM' => 'Viagem',
    ];

    public const SESSIONS = [
        'TATICO' => 'Tático',
        'TECNICO' => 'Técnico',
        'FISICO' => 'Físico',
        'REGENERATIVO' => 'Regenerativo',
        'BOLA_PARADA' => 'Bola parada',
    ];

    /**
     * @param array<string, string> $map
     */
    public static function of(array $map, ?string $value): string
    {
        return $value === null ? '' : ($map[$value] ?? $value);
    }
}
