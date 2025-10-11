/**
 * Jest Global Setup
 * Configuração que roda antes de todos os testes
 */

// Silencia todos os console.log, error e warn durante os testes
const noop = () => { };

global.console = {
    ...console,
    log: noop, // Silencia logs informativos
    error: noop, // Silencia erros esperados
    warn: noop, // Silencia warnings
    // Mantém debug, info, etc se necessário
};
