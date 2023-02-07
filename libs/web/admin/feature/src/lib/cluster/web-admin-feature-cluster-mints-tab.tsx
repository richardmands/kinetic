import { useToast } from '@chakra-ui/react'
import { WebAdminUiMintAddForm, WebAdminUiMints } from '@kin-kinetic/web/admin/ui'
import { WebUiPage } from '@kin-kinetic/web/ui/page'
import {
  Cluster,
  Mint,
  AdminMintCreateInput,
  useAdminMintCreateMutation,
  useAdminMintImportWalletMutation,
  useAdminDeleteMintMutation,
} from '@kin-kinetic/web/util/sdk'
import { Maybe } from 'graphql/jsutils/Maybe'

export function WebAdminFeatureClusterMintsTab({ cluster, mints }: { cluster: Cluster; mints: Maybe<Mint[]> }) {
  const toast = useToast()
  const [, addMintMutation] = useAdminMintCreateMutation()
  const [, importWalletMutation] = useAdminMintImportWalletMutation()
  const [, deleteWalletMutation] = useAdminDeleteMintMutation()

  const deleteMint = async (mintId: string) => {
    console.log('deleteMint', mintId)
    const confirm = window.confirm('Are you sure you want to delete this mint?')
    if (confirm) {
      deleteWalletMutation({ mintId }).then((res) => {
        if (res.error) {
          toast({
            title: 'Error deleting mint',
            description: res.error.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Mint deleted',
            description: 'The mint has been deleted.',
            status: 'success',
          })
        }
      })
    }
  }

  const importMintWallet = async (mintId: string, secret: string) => {
    console.log({
      mintId,
      secret,
    })
    importWalletMutation({ mintId, secret })
      .then((res) => {
        if (res.error) {
          toast({ status: 'error', title: 'Wallet import failed', description: `${res.error}` })
        } else {
          toast({ status: 'success', title: 'Wallet imported' })
        }
      })
      .catch((e) => {
        toast({ status: 'error', title: 'Wallet import failed', description: e.message })
      })
  }

  const addMint = (input: AdminMintCreateInput) => {
    addMintMutation({ input: { ...input, clusterId: cluster.id || '' } })
      .then((res) => {
        if (res?.data?.adminMintCreate) {
          toast({ status: 'success', title: 'Mint Added' })
        } else {
          toast({
            status: 'error',
            title: 'Something went wrong',
            description: `${res.error}`,
          })
        }
      })
      .catch((error) =>
        toast({
          status: 'error',
          title: 'Something went wrong',
          description: `${error}`,
        }),
      )
  }
  return (
    <WebUiPage title={'Cluster Mints'} actionRight={<WebAdminUiMintAddForm addMint={addMint} />}>
      <WebAdminUiMints
        clusterId={cluster.id || ''}
        mints={mints}
        deleteMint={deleteMint}
        importMintWallet={importMintWallet}
      />
    </WebUiPage>
  )
}
