using AutoMapper;
using Pacem.Push;
using Pacem.Push.Entities;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class MappingExtensions
    {
        public static void AddsMappings(this IMapperConfigurationExpression config)
        {
            config.CreateMap<VapidData, WebPush.VapidDetails>();

            config.CreateMap<Subscription, WebPush.PushSubscription>()
                .ForMember(p => p.P256DH, c => c.MapFrom(i => i.P256Dh))
                .ReverseMap()
                .ForMember(s => s.Expires, p => p.Ignore())
                .ForMember(s => s.Id, p => p.Ignore())
                .ForMember(s => s.UserId, p => p.Ignore())
                ;
        }
    }
}
