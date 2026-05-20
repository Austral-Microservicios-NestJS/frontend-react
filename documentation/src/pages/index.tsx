import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

function Hero() {
  return (
    <header className="hero--austral">
      <div className="container text--center">
        <h1>Austral CRM · Frontend</h1>
        <p>
          Documentación técnica del CRM de Austral Corredores de Seguros.
          Arquitectura, módulos, convenciones y guías para desarrollar y
          mantener el frontend con confianza.
        </p>
        <div className="hero__buttons">
          <Link className="button button--primary" to="/intro">
            Empezar
          </Link>
          <Link className="button button--secondary" to="/architecture/overview">
            Ver arquitectura →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Documentación del Frontend"
      description="Documentación técnica del CRM de Austral Corredores de Seguros."
    >
      <Hero />
      <main className="container">
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
