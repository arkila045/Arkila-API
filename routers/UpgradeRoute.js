import { addUpgrade, getUpgrades, updateUpgrade } from "../controllers/UpgradeController.js"

export const UpgradeRoute = async (fastify) => {
    fastify.get('/', getUpgrades)
    fastify.post('/', addUpgrade)
    fastify.patch('/:upgradeId', updateUpgrade)
}