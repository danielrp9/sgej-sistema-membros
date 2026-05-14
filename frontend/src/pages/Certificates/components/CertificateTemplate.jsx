import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    backgroundColor: '#ffffff', 
    border: '12pt solid #00df81' 
  },
  container: { 
    border: '1pt solid #E5E7EB', 
    height: '100%', 
    padding: 30,
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    textAlign: 'center',
    marginBottom: 20
  },
  title: { 
    fontFamily: 'Helvetica-Bold',
    fontSize: 24, 
    color: '#1A1D1F',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 30
  },
  content: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.8,
    color: '#374151',
    textAlign: 'justify',
    marginBottom: 40
  },
  bold: {
    fontFamily: 'Helvetica-Bold'
  },
  signatureSection: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  signatureBox: {
    width: '30%',
    borderTop: '1pt solid #9CA3AF',
    paddingTop: 5,
    alignItems: 'center'
  },
  signatureText: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#4B5563',
    textTransform: 'uppercase'
  },
  footer: {
    textAlign: 'center',
    fontSize: 7,
    color: '#9CA3AF',
    marginTop: 10
  }
});

export const CertificateTemplate = ({ certificate }) => {
  const member = certificate?.member || {};
  
  return (
    <Document title={`Certificado SGEJ - ${member.name}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Certificado de Atividade Voluntária</Text>
          </View>

          <Text style={styles.content}>
            A <Text style={styles.bold}>Empresa Júnior Next Step</Text> certifica que o(a) membro colaborador(a) acima citado(a), 
            <Text style={styles.bold}> {member.name?.toUpperCase()} </Text>, 
            inscrito(a) no CPF nº <Text style={styles.bold}>{member.cpf || 'xxx.xxx.xxx-xx'}</Text> e 
            matrícula nº <Text style={styles.bold}>{member.registration}</Text>, regularmente matriculado(a) 
            no curso de Bacharelado em Sistemas de Informação da Universidade Federal dos Vales do Jequitinhonha 
            e Mucuri (UFVJM), integrou a equipe da empresa exercendo o cargo de 
            <Text style={styles.bold}> {member.role || 'COLABORADOR(A)'} </Text>, 
            no Departamento <Text style={styles.bold}> {member.department || 'OPERACIONAL'} </Text>, 
            no período de <Text style={styles.bold}>{member.start_date || 'xx/xx/xxxx'}</Text> à 
            <Text style={styles.bold}> {new Date().toLocaleDateString('pt-BR')} </Text>, 
            totalizando <Text style={styles.bold}>{member.calculated_hours || 0} horas</Text> de trabalho voluntário.
          </Text>

          {/* Área de Assinaturas */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Recursos Humanos</Text>
              <Text style={[styles.signatureText, {fontSize: 6}]}>Next Step</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Coordenadora SGEJ</Text>
              <Text style={[styles.signatureText, {fontSize: 6}]}>UFVJM</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Diretor(a) Presidente</Text>
              <Text style={[styles.signatureText, {fontSize: 6}]}>Next Step</Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Código de Autenticidade: {certificate.auth_uuid} • Verifique em: sgej.cloud/verify
          </Text>
        </View>
      </Page>
    </Document>
  );
};