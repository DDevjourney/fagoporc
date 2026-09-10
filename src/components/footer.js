export function renderFooter(container) {
  if (!container) throw new Error('renderFooter: container is required')

  container.classList.add('footer')
  container.innerHTML = `
    <div class="wrap footer__inner">
      <div class="footer__brand">
        <strong>Fagoporc</strong>
        <span>Grupo Operativo Supraautonómico para el desarrollo de bacteriófagos frente a <em>E. coli</em> y <em>Salmonella</em> spp. en producción porcina.</span>
      </div>

      <div class="footer__partners">
        <span>Consorcio</span>
        <span>CTAEX · Ibergenética Extremeña · Piensos Costa</span>
      </div>
    </div>

    <div class="wrap footer__foot">
      <span>© ${new Date().getFullYear()} G.O. Fagoporc</span>
      <span>Financiado en el marco del PEPAC</span>
    </div>
  `
}
