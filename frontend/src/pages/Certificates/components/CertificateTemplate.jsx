import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoVerdeEJ from '../../../../public/nextstep-logoverde.png';
import carimboAssinatura from '../../../../public/nextstep-logoverde.png';

const styles = StyleSheet.create({
  page: { 
    padding: 24, 
    backgroundColor: '#ffffff',
    position: 'relative'
  },

  borderFrame: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    border: '6pt solid #00df81',
    borderRadius: 8,
    pointerEvents: 'none',
    zIndex: 0
  },
 
  container: { 
    height: 520, 
    maxHeight: 520,
    width: '100%',
    paddingTop: 15, 
    paddingBottom: 5, 
    paddingHorizontal: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    zIndex: 10
  },
 
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    marginBottom: 5
  },
  brandLogo: {
    width: 55,
    height: 55,
    objectFit: 'contain',
    alignSelf: 'flex-start' 
  },
  headerTitles: {
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 15,
    marginTop: 25 
  },
  subHeaderTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#00df81',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 6
  },
  mainTitle: { 
    fontFamily: 'Helvetica-Bold',
    fontSize: 26, 
    color: '#111315',
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  divider: {
    width: '40%',
    height: 1.5,
    backgroundColor: '#00df81',
    marginTop: 8,
    borderRadius: 1
  },

  contentBlock: {
    marginTop: 15, 
    marginBottom: 15, 
    paddingHorizontal: 5
  },
  contentParagraph: {
    fontFamily: 'Helvetica',
    fontSize: 12.5,
    lineHeight: 1.65, 
    color: '#2D3135',
    textAlign: 'justify'
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
    color: '#111315'
  },
  
  // CONTAINER DAS ASSINATURAS GOV.BR STYLE
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 'auto',
    marginBottom: 5
  },
  govSignCard: {
    width: '32%',
    border: '1pt solid #00df81',
    backgroundColor: '#F4FBF7',
    borderRadius: 6,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 58
  },
  govLogo: {
    width: 22,
    height: 22,
    objectFit: 'contain'
  },
  govTextMeta: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  govSignerName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#111315',
    textTransform: 'uppercase',
    marginBottom: 1
  },
  govCargoText: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    color: '#4B5563',
    textTransform: 'uppercase',
    marginBottom: 1
  },
  govTechnicalDetails: {
    fontSize: 5,
    fontFamily: 'Helvetica',
    color: '#6B7280',
    lineHeight: 1.2
  },
  govCryptoStatus: {
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    color: '#00df81',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.2
  },
  
  // Slot de espera quando um gestor ainda não assinou
  pendingBox: {
    width: '32%',
    border: '1pt dashed #D1D5DB',
    borderRadius: 6,
    height: 58, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB'
  },
  pendingText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Oblique',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  
  footer: {
    textAlign: 'center',
    fontSize: 6.5,
    fontFamily: 'Helvetica',
    color: '#6B7280',
    borderTop: '0.5pt solid #E5E7EB',
    paddingTop: 5,
    marginTop: 5
  }
});

export const CertificateTemplate = ({ certificate }) => {
  const member = certificate?.member || {};

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const d = new Date(dateTimeStr);
    const dateFormatted = d.toLocaleDateString('pt-BR');
    const timeFormatted = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${dateFormatted} às ${timeFormatted}`;
  };

  return (
    <Document title={`Certificado SGEJ - ${member.name}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.borderFrame} />

        <View style={styles.container}>
          
          {/* Topo Institucional */}
          <View style={styles.headerRow}>
            {/* Espaçador invisível à esquerda para manter simetria horizontal do texto */}
            <View style={{ width: 55, alignSelf: 'flex-start' }} />
            
            <View style={styles.headerTitles}>
              <Text style={styles.subHeaderTitle}>NextStep Empresa Júnior</Text>
              <Text style={styles.mainTitle}>Certificado</Text>
              <View style={styles.divider} />
            </View>
            
            <Image src={logoVerdeEJ} style={styles.brandLogo} />
          </View>

          {/* Texto de Outorga */}
          <View style={styles.contentBlock}>
            <Text style={styles.contentParagraph}>
              A <Text style={styles.bold}>Empresa Júnior NextStep</Text> certifica que o(a) membro colaborador(a) acima citado(a), <Text style={styles.bold}>{member.name?.toUpperCase()}</Text>, inscrito(a) no CPF nº <Text style={styles.bold}>{member.cpf || 'xxx.xxx.xxx-xx'}</Text> e matrícula nº <Text style={styles.bold}>{member.registration}</Text>, regularmente matriculado(a) no curso de Bacharelado em Sistemas de Informação da Universidade Federal dos Vales do Jequitinhonha e Mucuri (UFVJM), integrou a equipe da empresa exercendo o cargo de <Text style={styles.bold}>{member.role || 'COLABORADOR(A)'}</Text>, no Departamento <Text style={styles.bold}>{member.department || 'OPERACIONAL'}</Text>, no período de <Text style={styles.bold}>{member.start_date || 'xx/xx/xxxx'}</Text> à <Text style={styles.bold}>{certificate.issue_date ? new Date(certificate.issue_date).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</Text>, totalizando <Text style={styles.bold}>{member.calculated_hours || 0} horas</Text> de atividades voluntárias e desenvolvimento profissional.
            </Text>
          </View>

          {/* Seção das Três Assinaturas Digitais Coletivas */}
          <View style={styles.signatureSection}>
            
            {/* Slot 1: Diretor de RH */}
            {certificate.signed_by_director ? (
              <View style={styles.govSignCard}>
                <Image src={carimboAssinatura} style={styles.govLogo} />
                <View style={styles.govTextMeta}>
                  <Text style={styles.govSignerName} numberOfLines={1}>{certificate.director_name}</Text>
                  <Text style={styles.govCargoText}>Recursos Humanos - RH</Text>
                  <Text style={styles.govTechnicalDetails}>Data: {formatDateTime(certificate.signed_at_director)}</Text>
                  <Text style={styles.govTechnicalDetails}>Ref: SGEJ-VAL-RH-{certificate.id}</Text>
                  <Text style={styles.govCryptoStatus}>✓ Assinado Digitalmente</Text>
                </View>
              </View>
            ) : (
              <View style={styles.pendingBox}>
                <Text style={styles.pendingText}>Aguardando Assinatura RH</Text>
              </View>
            )}

            {/* Slot 2: Coordenadora / Orientadora PROAAE */}
            {certificate.signed_by_orientador ? (
              <View style={styles.govSignCard}>
                <Image src={carimboAssinatura} style={styles.govLogo} />
                <View style={styles.govTextMeta}>
                  <Text style={styles.govSignerName} numberOfLines={1}>{certificate.orientador_name}</Text>
                  <Text style={styles.govCargoText}>Coordenador(a)</Text>
                  <Text style={styles.govTechnicalDetails}>Data: {formatDateTime(certificate.signed_at_orientador)}</Text>
                  <Text style={styles.govTechnicalDetails}>Ref: SGEJ-VAL-COORD-{certificate.id}</Text>
                  <Text style={styles.govCryptoStatus}>✓ Assinado Digitalmente</Text>
                </View>
              </View>
            ) : (
              <View style={styles.pendingBox}>
                <Text style={styles.pendingText}>Aguardando Coordenador(a)</Text>
              </View>
            )}

            {/* Slot 3: Diretor Presidente */}
            {certificate.signed_by_president ? (
              <View style={styles.govSignCard}>
                <Image src={carimboAssinatura} style={styles.govLogo} />
                <View style={styles.govTextMeta}>
                  <Text style={styles.govSignerName} numberOfLines={1}>{certificate.president_name}</Text>
                  <Text style={styles.govCargoText}>Presidente</Text>
                  <Text style={styles.govTechnicalDetails}>Data: {formatDateTime(certificate.signed_at_president)}</Text>
                  <Text style={styles.govTechnicalDetails}>Ref: SGEJ-VAL-PRES-{certificate.id}</Text>
                  <Text style={styles.govCryptoStatus}>✓ Assinado Digitalmente</Text>
                </View>
              </View>
            ) : (
              <View style={styles.pendingBox}>
                <Text style={styles.pendingText}>Aguardando Presidente</Text>
              </View>
            )}

          </View>

          {/* Rodapé de Validação Permanente */}
          <Text style={styles.footer}>
            {certificate.status === 'APPROVED' && certificate.auth_hash
              ? `Código de Autenticidade Permanente: ${certificate.auth_hash} • Documento assinado eletronicamente em conformidade com as diretrizes institucionais da UFVJM.`
              : `Protocolo Provisório de Rascunho Auditável: ${certificate.auth_uuid} • Inválido para fins de comprovação externa até a conclusão do lote.`
            }
          </Text>
        </View>
      </Page>
    </Document>
  );
};