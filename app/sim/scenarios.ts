import type { Scenario } from './rules'

// Same inputs as the "Scenarios" sheet in public/sim/investment-sim.xlsx.
// Returns are yearly percentages for each asset class.
export const STARTING_BALANCE = 10000

export const SCENARIOS: Scenario[] = [
  {
    id: 'calm-year',
    title: 'A calm year',
    teaser: 'Unemployment is low and company profits are growing. Analysts expect a quiet year.',
    returns: { cash: 2, bonds: 3.5, shares: 9 },
    why: 'Steady economic growth lets companies grow their profits, and share prices follow. Bonds and cash paid their usual interest, but in a calm year the extra risk of shares is rewarded.'
  },
  {
    id: 'rates-jump',
    title: 'Interest rates jump',
    teaser: 'Prices in the shops are rising fast. The central bank meets next week.',
    returns: { cash: 4, bonds: -6, shares: -3 },
    why: 'The central bank raised interest rates to fight inflation. Existing bonds pay the old, lower rate, so their price fell. Higher borrowing costs squeezed companies, so shares dipped too. Cash was the winner because savings accounts now pay more.'
  },
  {
    id: 'crash',
    title: 'Market crash',
    teaser: 'A big bank is rumoured to be in trouble. Headlines are getting nervous.',
    returns: { cash: 3, bonds: 6, shares: -22 },
    why: 'Panic spread and investors sold shares to get out of risky assets. Money rushed into safe government bonds and the central bank cut rates, which pushed bond prices up. Diversifying away from shares protected your balance.'
  },
  {
    id: 'recovery',
    title: 'Recovery rally',
    teaser: 'The worst seems to be over, though many people are still too scared to invest.',
    returns: { cash: 1.5, bonds: 2, shares: 26 },
    why: 'Shares bounced back hard from cheap prices once confidence returned. Investors who stayed in (or bought after the crash) captured the rebound. Cash rates were low, so sitting on the sidelines cost real growth.'
  },
  {
    id: 'inflation',
    title: 'Inflation creeps in',
    teaser: 'Wages and rents are rising. Some economists warn of inflation, others say it will pass.',
    returns: { cash: 3, bonds: -2, shares: 5 },
    why: 'Inflation crept up, which hurts bonds because their fixed payments buy less over time. Companies passed higher costs on to customers, so shares still grew modestly. Cash held its value but only just kept up with prices.'
  }
]
